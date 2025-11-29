import { BackButton } from '@/src/components/base/back-button'
import { Button, ButtonSpinner, ButtonText } from '@/src/components/ui/button'
import { Card } from '@/src/components/ui/card'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { Input, InputField } from '@/src/components/ui/input'
import { VStack } from '@/src/components/ui/vstack'
import { getStatusBarHeight } from '@/src/lib/get-status-bar-height'
import { userCVKey } from '@/src/lib/query-kye'
import FileService from '@/src/services/file-service'
import UserCvService, { type UserCvModel } from '@/src/services/user-cv-service'
import { useAuthStore } from '@/src/stores/auth-store'
import { IconFileCv, IconPencil, IconTrash } from '@tabler/icons-react-native'
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

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: userCVKey.lists() })

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

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (!token) throw new Error('Token manquant')
      return UserCvService.updateOne(id, { name }, token)
    },
    onSuccess: async () => {
      await invalidateList()
      Toast.show({
        type: 'success',
        text1: 'Nom du CV mis à jour',
        visibilityTime: 3000,
      })
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Échec de la mise à jour',
        text2: error?.message || 'Impossible de renommer le CV.',
        visibilityTime: 6000,
      })
    },
  })

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
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

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingName, setEditingName] = React.useState<string>('')

  const startEditing = (cv: UserCvModel) => {
    setEditingId(cv.id)
    setEditingName(cv.name || '')
  }
  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }
  const saveEditing = () => {
    if (!editingId) return
    const trimmed = editingName.trim()
    if (!trimmed) {
      Toast.show({
        type: 'error',
        text1: 'Nom invalide',
        text2: 'Veuillez saisir un nom valide.',
      })
      return
    }
    updateMutation.mutate({ id: editingId, name: trimmed })
    cancelEditing()
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

  const isMutating = uploadMutation.isPending || deleteMutation.isPending || updateMutation.isPending

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
          <Text className='text-sm text-jego-muted-foreground'>
            Formats acceptés: PDF, DOC, DOCX • Taille max: 5MB
          </Text>

          {/* List */}
          {(isFetching && !data?.data?.length) ? (
            <Card className='p-4'>
              <Text className='text-sm text-jego-muted-foreground'>Chargement des CV...</Text>
            </Card>
          ) : data?.data?.length ? (
            <VStack space='md'>
              {data.data.map((cv) => (
                <Card key={cv.id} className='p-4'>
                  {editingId === cv.id ? (
                    <VStack space='md'>
                      <Input size='xl' className='rounded-lg bg-jego-card'>
                        <InputField
                          value={editingName}
                          onChangeText={setEditingName}
                          placeholder='Nom du CV'
                          autoCapitalize='none'
                          returnKeyType='done'
                          onSubmitEditing={saveEditing}
                        />
                      </Input>
                      <HStack className='justify-end' space='md'>
                        <Button variant='outline' size='md' onPress={cancelEditing} className='rounded-full'>
                          <ButtonText>Annuler</ButtonText>
                        </Button>
                        <Button
                          action='primary'
                          variant='solid'
                          size='md'
                          onPress={saveEditing}
                          isDisabled={updateMutation.isPending}
                          className='rounded-full bg-jego-primary'
                        >
                          {updateMutation.isPending && <ButtonSpinner className='text-jego-primary-foreground' />}
                          <ButtonText className='text-jego-primary-foreground'>Enregistrer</ButtonText>
                        </Button>
                      </HStack>
                    </VStack>
                  ) : (
                    <HStack className='items-center' space='md'>
                      <Icon as={IconFileCv} size='xl' className='text-jego-foreground' />
                      <VStack className='flex-1'>
                        <Text className='text-base font-medium text-jego-foreground' numberOfLines={1}>
                          {cv.name}
                        </Text>
                        <Text className='text-xs text-jego-muted-foreground' numberOfLines={1}>
                          {cv.type?.toUpperCase()} • Ajouté le {new Date(cv.createdAt).toLocaleDateString('fr-FR')}
                        </Text>
                      </VStack>
                      <HStack space='sm'>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => startEditing(cv)}
                          className='h-10 px-3 rounded-full border border-jego-border justify-center'
                        >
                          <HStack className='items-center' space='xs'>
                            <Icon as={IconPencil} className='text-jego-foreground' size='sm' />
                            <Text className='text-sm text-jego-foreground'>Renommer</Text>
                          </HStack>
                        </TouchableOpacity>
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
                  )}
                </Card>
              ))}
              <View className='h-10' />
            </VStack>
          ) : (
            <Card className='p-4'>
              <Text className='text-sm text-jego-muted-foreground'>
                Aucun CV pour le moment. Ajoutez votre premier CV pour vos candidatures.
              </Text>
            </Card>
          )}
        </VStack>
        <View className='h-20' />
      </ScrollView>
    </View>
  )
}


