import { BackButton } from '@/src/components/base/back-button'
import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Button, ButtonSpinner, ButtonText } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { userCVKey } from '@/src/lib/query-kye'
import { formatDate, getFileTypeName } from '@/src/lib/utils'
import FileService from '@/src/services/file-service'
import UserCvService, { type UserCvModel } from '@/src/services/user-cv-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { IconFileCv, IconTrash } from '@tabler/icons-react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as DocumentPicker from 'expo-document-picker'
import React from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

export default function UserCvFilesScreen() {
  const height = getStatusBarHeight()
  const auth = useAuthStore((s) => s.auth)
  const queryClient = useQueryClient()

  const token = auth?.token
  const userId = auth?.user?.id

  const { data, isFetching } = useQuery({
    queryKey: userCVKey.list({ userId, page: 1, limit: 50 }),
    queryFn: async () => {
      if (!token || !userId) throw new Error('Token manquant')
      return UserCvService.getAll({ userId, page: 1, limit: 50 }, token)
    },
    enabled: !!token && !!userId,
  })

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: userCVKey.lists() })

  const uploadMutation = useMutation({
    mutationFn: async (asset: DocumentPicker.DocumentPickerAsset) => {
      if (!token || !userId) throw new Error('Token manquant')
      const nameFromAsset = asset.name || `cv-${Date.now()}`
      const mime = asset.mimeType || 'application/pdf'
      const file: any = {
        uri: asset.uri,
        name: nameFromAsset,
        type: mime,
      }
      const uploaded = await FileService.uploadSingleFile(file, token)

      if (!uploaded?.name) throw new Error('Nom du fichier manquant')

      await UserCvService.createOne(
        {
          userId,
          name: uploaded?.name || nameFromAsset,
          path: uploaded?.path,
          type: uploaded?.type || mime,
        },
        token,
      )
    },
    onSuccess: async () => {
      await invalidateList()
      Toast.show({
        type: 'success',
        text1: 'CV ajouté',
        text2: 'Votre CV a été ajouté avec succès.',
        visibilityTime: 4000,
      })
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Échec de l’ajout',
        text2: error?.message || 'Impossible d’ajouter votre CV.',
        visibilityTime: 6000,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (cv: UserCvModel) => {
      if (!token) throw new Error('Token manquant')
      return UserCvService.deleteOne(cv.id, token)
    },
    onSuccess: async () => {
      await invalidateList()
      Toast.show({
        type: 'success',
        text1: 'CV supprimé',
        visibilityTime: 3000,
      })
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Échec de la suppression',
        text2: error?.message || 'Impossible de supprimer le CV.',
        visibilityTime: 6000,
      })
    },
  })

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf', // .pdf
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        ],
        multiple: false,
        copyToCacheDirectory: true,
      })
      if (result.canceled) return
      const asset = result.assets?.[0]
      if (asset?.uri) {
        uploadMutation.mutate(asset)
      }
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Sélection de document annulée',
        text2: e?.message,
        visibilityTime: 4000,
      })
    }
  }

  const confirmDelete = (cv: UserCvModel) => {
    Alert.alert(
      'Supprimer le CV',
      `Voulez-vous vraiment supprimer “${cv.name}” ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteMutation.mutate(cv) },
      ],
      { cancelable: true },
    )
  }

  const isMutating = uploadMutation.isPending || deleteMutation.isPending

  return (
    <View style={{ flex: 1 }} className='bg-jego-background'>
      <HStack space='md' className='p-4 bg-jego-card border-b border-jego-border' style={{ paddingTop: height + 10 }}>
        <BackButton />
        <VStack className='flex-1'>
          <Text className='font-semibold text-base text-jego-foreground' numberOfLines={1}>
            Mes CV
          </Text>
          <Text className='text-sm text-jego-muted-foreground'>Gérez vos fichiers CV pour vos candidatures.</Text>
        </VStack>
      </HStack>

      <ScrollView className='flex-1' contentContainerClassName='p-4'>
        <VStack space='lg'>
          {/* List */}
          {isFetching && !data?.data?.length ? (
            <LoaderContent />
          ) : data?.data?.length ? (
            <VStack space='md'>
              {data.data.map((cv) => (
                <Card key={cv.id} className='p-4'>
                  <HStack className='items-center' space='md'>
                    <Icon as={IconFileCv} size='xl' className='text-jego-foreground' />
                    <VStack className='flex-1'>
                      <Text className='text-base font-medium text-jego-foreground' numberOfLines={1}>
                        {cv.name}
                      </Text>
                      <Text className='text-xs text-jego-muted-foreground' numberOfLines={1}>
                        {getFileTypeName(cv.type)} • Ajouté le {formatDate(cv.createdAt)}
                      </Text>
                    </VStack>
                    <HStack space='sm'>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => confirmDelete(cv)}
                        className='h-10 px-3 rounded-full border border-jego-destructive/40 justify-center'
                      >
                        <HStack className='items-center' space='xs'>
                          <Icon as={IconTrash} className='text-jego-destructive' size='sm' />
                          <Text className='text-sm text-jego-destructive'>Supprimer</Text>
                        </HStack>
                      </TouchableOpacity>
                    </HStack>
                  </HStack>
                </Card>
              ))}
            </VStack>
          ) : (
            <EmptyContent text='Aucun CV pour le moment. Ajoutez votre premier CV pour vos candidatures.'/>
          )}

          <Text className='text-sm text-jego-muted-foreground mt-3'>Formats acceptés: PDF, DOC, DOCX • Taille max: 5MB</Text>

          <Button
            action='primary'
            variant='solid'
            size='lg'
            onPress={pickDocument}
            isDisabled={isMutating}
            className='rounded-full bg-jego-primary'
          >
            {uploadMutation.isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
            <ButtonText className='text-jego-primary-foreground'>Ajouter un CV</ButtonText>
          </Button>
        </VStack>
        <View className='h-20' />
      </ScrollView>
    </View>
  )
}
