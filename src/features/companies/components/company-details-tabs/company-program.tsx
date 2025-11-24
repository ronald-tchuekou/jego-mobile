import EmptyContent from '@/src/components/base/empty-content'
import { Box } from '@/src/components/ui/box'
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { CompanyModel } from '@/src/services/company-service'
import { memo } from 'react'
import { Text } from 'react-native'

type Props = {
  company: CompanyModel
}

const CompanyProgram = ({ company }: Props) => {
  const program = company.dailyProgram

  return (
    <>
      <Text className={'text-xl font-semibold mb-3'}>Horaires d&apos;ouverture</Text>
      {!program ? (
        <EmptyContent text="Aucun horaire d'ouverture disponible pour cette entreprise." />
      ) : (
        <Box className='rounded-xl bg-jego-card border border-jego-border overflow-hidden'>
          <Table className='w-full'>
            <TableHeader className='bg-gray-200'>
              <TableRow>
                <TableHead className='text-sm'>Jour</TableHead>
                <TableHead className='text-sm'>Ouvert à</TableHead>
                <TableHead className='text-sm'>Fermé à</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableData className='text-sm'>Lundi</TableData>
                <TableData className='text-sm'>{program['Lundi'].open || '- - -'}</TableData>
                <TableData className='text-sm'>{program['Lundi'].close || '- - -'}</TableData>
                </TableRow>
                <TableRow>
                  <TableData className='text-sm'>Mardi</TableData>
                  <TableData className='text-sm'>{program['Mardi'].open || '- - -'}</TableData>
                  <TableData className='text-sm'>{program['Mardi'].close || '- - -'}</TableData>
                </TableRow>
                <TableRow>
                  <TableData className='text-sm'>Mercredi</TableData>
                  <TableData className='text-sm'>{program['Mercredi'].open || '- - -'}</TableData>
                  <TableData className='text-sm'>{program['Mercredi'].close || '- - -'}</TableData>
                </TableRow>
                <TableRow>
                  <TableData className='text-sm'>Jeudi</TableData>
                  <TableData className='text-sm'>{program['Jeudi'].open || '- - -'}</TableData>
                  <TableData className='text-sm'>{program['Jeudi'].close || '- - -'}</TableData>
                </TableRow>
                <TableRow>
                  <TableData className='text-sm'>Vendredi</TableData>
                  <TableData className='text-sm'>{program['Vendredi'].open || '- - -'}</TableData>
                  <TableData className='text-sm'>{program['Vendredi'].close || '- - -'}</TableData>
                </TableRow>
                <TableRow>
                  <TableData className='text-sm'>Samedi</TableData>
                  <TableData className='text-sm'>{program['Samedi'].open || '- - -'}</TableData>
                  <TableData className='text-sm'>{program['Samedi'].close || '- - -'}</TableData>
                </TableRow>
                <TableRow>
                  <TableData className='text-sm'>Dimanche</TableData>
                  <TableData className='text-sm'>{program['Dimanche'].open || '- - -'}</TableData>
                  <TableData className='text-sm'>{program['Dimanche'].close || '- - -'}</TableData>
                </TableRow>
            </TableBody>
          </Table>
        </Box>
      )}
    </>
  )
}

export default memo(CompanyProgram)
