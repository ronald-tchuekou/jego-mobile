import EmptyContent from '@/src/components/base/empty-content'
import { LoaderContent } from '@/src/components/base/loader-content'
import { Button, ButtonSpinner, ButtonText } from '@/src/components/ui/button'
import { HStack } from '@/src/components/ui/hstack'
import { Icon } from '@/src/components/ui/icon'
import { VStack } from '@/src/components/ui/vstack'
import { jobKey, userCVKey } from '@/src/lib/query-kye'
import { getFileTypeName } from '@/src/lib/utils'
import JobApplicationService from '@/src/services/job-application-service'
import { JobModel } from '@/src/services/job-service'
import UserCvService from '@/src/services/user-cv-service'
import { useAuthStore } from '@/src/stores/auth-store'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { IconCircle, IconCircleFilled, IconFileCv } from '@tabler/icons-react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

type Props = {
  job: JobModel | null
}

const SendApplication = ({ job }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const auth = useAuthStore((s) => s.auth)
  const token = auth?.token
  const userId = auth?.user?.id

  const alreadyApplied = !!job && !!userId ? !!job.applications?.some((a) => a.userId === userId) : false

  const [isOpen, setIsOpen] = useState(false)
  const [selectedCvPath, setSelectedCvPath] = useState<string>('')

  const { data, isFetching: isFetchingCvs } = useQuery({
    queryKey: userCVKey.list({ userId, page: 1, limit: 3 }),
    queryFn: async () => {
      if (!token || !userId) throw new Error('Token manquant')
      return UserCvService.getAll({ userId, page: 1, limit: 50 }, token)
    },
    enabled: isOpen && !!token && !!userId,
  })

  const sendMutation = useMutation({
    mutationFn: (body: { jobId: string; resumePath: string; userId: string; token: string }) => {
      const { jobId, resumePath, userId, token } = body
      return JobApplicationService.create({ jobId, resumePath, userId }, token)
    },
    onSuccess() {
      Toast.show({
        type: 'success',
        text1: 'Candidature envoyée',
      })
      closeSheet()
      if (job?.id) {
        queryClient.invalidateQueries({ queryKey: jobKey.detail(job.id) })
      }
    },
    onError: (error) => {
      console.error('Error sending application', error)

      Toast.show({
        type: 'error',
        text1: 'Échec de l’envoi',
        text2: error?.message || 'Impossible d’envoyer votre candidature.',
      })
    },
  })

  const snapPoints = useMemo(() => ['40%'], [])
  const cvList = data?.data || []

  const openSheet = useCallback(() => {
    setSelectedCvPath('')
    bottomSheetRef.current?.expand()
  }, [])

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const handleSubmitApplication = () => {
    if (!job?.id) {
      Toast.show({
        type: 'error',
        text1: 'Impossible d’envoyer',
        text2: 'Veuillez sélectionner un job.',
      })
      return
    }

    if (!selectedCvPath) {
      Toast.show({
        type: 'error',
        text1: 'Impossible d’envoyer',
        text2: 'Veuillez sélectionner un CV.',
      })
      return
    }

    if (!token || !userId) {
      Toast.show({
        type: 'error',
        text1: 'Impossible d’envoyer',
        text2: 'Veuillez vous connecter pour postuler.',
      })
      return
    }

    sendMutation.mutate({ jobId: job.id, resumePath: selectedCvPath, token, userId })
  }

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior='close' />,
    [],
  )

  return (
    <>
      <View className='px-4 py-2 bg-jego-card border-t border-jego-border' style={{ paddingBottom: insets.bottom }}>
        {alreadyApplied ? (
          <View className='mt-2 rounded-full border border-jego-border py-3 px-4 bg-jego-card'>
            <Text className='text-center text-sm text-jego-muted-foreground'>Vous avez déjà postulé à ce job.</Text>
          </View>
        ) : (
          <Button
            disabled={!job}
            action='primary'
            variant='solid'
            size='lg'
            className='rounded-full mt-2 bg-jego-primary'
            onPress={openSheet}
          >
            <ButtonText className='text-jego-primary-foreground'>Postuler maintenant</ButtonText>
          </Button>
        )}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={(i) => setIsOpen(i >= 0)}
        backgroundStyle={{
          backgroundColor: 'transparent',
        }}
           handleIndicatorStyle={{
            backgroundColor: 'red',
           }}
      >
        <BottomSheetView className='px-5 py-4 bg-jego-card rounded-t-2xl'>
          <Text className='text-xl font-semibold text-jego-foreground'>Envoyer ma candidature</Text>
          {!!job?.title && (
            <Text className='text-base text-jego-muted-foreground mt-1'>
              Job: <Text className='font-medium text-jego-primary'>{job.title}</Text>
            </Text>
          )}

          <View className='h-[1px] bg-jego-border my-3' />

          <Text className='text-base font-medium text-jego-foreground mb-2'>Sélectionner un CV</Text>

          {isFetchingCvs ? (
            <LoaderContent />
          ) : cvList?.length ? (
            <VStack space='md'>
              {cvList.map((cv) => {
                const selected = selectedCvPath === cv.path
                return (
                  <Pressable
                    key={cv.id}
                    onPress={() => setSelectedCvPath(cv.path)}
                    className={`p-3 flex flex-row items-center gap-2 rounded-lg border ${
                      selected ? 'border-jego-primary bg-jego-primary/10' : 'border-jego-border'
                    }`}
                  >
                    <Icon as={IconFileCv} size='xl' className='text-jego-foreground' />
                    <View className='flex-1'>
                      <Text className='text-base text-jego-foreground' numberOfLines={1}>
                        {cv.name}
                      </Text>
                      <Text className='text-sm text-jego-muted-foreground' numberOfLines={1}>
                        {getFileTypeName(cv.type)}
                      </Text>
                    </View>
                    {selected ? (
                      <IconCircleFilled color={'red'} style={{ height: 20, width: 20 }} />
                    ) : (
                      <Icon as={IconCircle} style={{ height: 24, width: 24 }} className='text-jego-muted-foreground' />
                    )}
                  </Pressable>
                )
              })}
            </VStack>
          ) : (
            <EmptyContent
              text='Aucun CV trouvé. Ajoutez un CV pour postuler.'
              actionContent={
                <Button
                  action='secondary'
                  variant='outline'
                  size='md'
                  className='rounded-full'
                  onPress={() => {
                    closeSheet()
                    router.push('/profile/cv-files')
                  }}
                >
                  <ButtonText>Gérer mes CV</ButtonText>
                </Button>
              }
            />
          )}

          <View className='h-6' />

          {!!cvList?.length && (
            <HStack className='mb-8' space='md'>
              <Button
                action='secondary'
                variant='outline'
                size='lg'
                className='rounded-full flex-1'
                onPress={closeSheet}
              >
                <ButtonText>Annuler</ButtonText>
              </Button>
              <Button
                action='primary'
                variant='solid'
                size='lg'
                className='rounded-full bg-jego-primary flex-1'
                disabled={!selectedCvPath || sendMutation.isPending || !job}
                onPress={handleSubmitApplication}
              >
                <ButtonText className='text-jego-primary-foreground'>
                  {sendMutation.isPending ? (
                    <ButtonSpinner className='text-jego-primary-foreground' />
                  ) : (
                    <ButtonText className='text-jego-primary-foreground'>Envoyer</ButtonText>
                  )}
                </ButtonText>
              </Button>
            </HStack>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}

export default memo(SendApplication)
