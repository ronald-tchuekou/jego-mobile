import { CompanyModel } from './company-service'

export enum CompanyDocStatus {
  WAITING = 'waiting',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type CompanyDocModel = {
  id: string
  companyId: string
  name: string
  path: string | null
  type: string | null
  size: string | null
  status: CompanyDocStatus
  createdAt: string
  updatedAt: string
  company: CompanyModel
}

const CompanyDocService = {}

export default CompanyDocService
