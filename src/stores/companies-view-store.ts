import { create } from 'zustand'
import { CompanyModel } from '../services/company-service'

export type ViewMode = 'map' | 'list'

export type CompaniesViewState = {
  viewMode: ViewMode
  isListVisible: boolean
  isLoadingCompanies: boolean
  companies: CompanyModel[]
  selectedCompany: CompanyModel | null
  page: number
  totalPage: number
  showList: VoidFunction
  hideList: VoidFunction
  setCompanies: (companies: CompanyModel[], page: number, totalPage: number) => void
  addNewCompanies: (companies: CompanyModel[], page: number, totalPage: number) => void
  setLoadingCompanies: (isLoading: boolean) => void
  showCompany: (company: CompanyModel | null) => void
  changeViewMode: (mode: ViewMode) => void
}

export const useCompaniesViewStore = create<CompaniesViewState>((set) => ({
  viewMode: 'list',
  isListVisible: true,
  companies: [],
  isLoadingCompanies: false,
  selectedCompany: null,
  page: 1,
  totalPage: 1,
  setCompanies(companies, page, totalPage) {
    set((state) => ({
      ...state,
      companies: [...state.companies, ...companies],
      page,
      totalPage,
    }))
  },
  addNewCompanies(companies, page, totalPage) {
    set((state) => ({
      ...state,
      companies: [...state.companies, ...companies],
      page,
      totalPage,
    }))
  },
  setLoadingCompanies(isLoading: boolean) {
    set({ isLoadingCompanies: isLoading })
  },
  showList() {
    set({ isListVisible: true })
  },
  hideList() {
    set({ isListVisible: false })
  },
  showCompany(company: CompanyModel | null) {
    set({ selectedCompany: company })
  },
  changeViewMode(mode: ViewMode) {
    set({ viewMode: mode })
  },
}))
