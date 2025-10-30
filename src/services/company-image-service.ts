import { CompanyModel } from './company-service'

export type CompanyImageModel = {
  id: string
  companyId: string
  path: string
  name: string
  createdAt: string
  updatedAt: string
  company: CompanyModel
}

const CompanyImageService = {}

export default CompanyImageService
