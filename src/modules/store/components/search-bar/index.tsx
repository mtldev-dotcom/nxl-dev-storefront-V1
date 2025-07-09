// =============================
// SearchBar component commented out at user request (2024-06-09)
// Reason: Temporarily disabling search bar functionality. Restore when needed.
// =============================
//
// "use client"
//
// import React, { useState, useEffect, useRef } from 'react'
// import { useRouter, usePathname, useSearchParams } from 'next/navigation'
//
// import { useDebounce } from '../../../../hooks/useDebounce'
// import clsx from 'clsx'
//
// interface SearchSuggestion {
//     id: string
//     title: string
//     type: 'product' | 'category' | 'collection'
//     handle?: string
// }
//
// interface SearchBarProps {
//     placeholder?: string
//     className?: string
//     showSuggestions?: boolean
// }
//
// export const SearchBar: React.FC<SearchBarProps> = ({
//     placeholder,
//     className = '',
//     showSuggestions = true
// }) => {
//
//     const router = useRouter()
//     const pathname = usePathname()
//     const searchParams = useSearchParams()
//
//     // State management
//     const [query, setQuery] = useState('')
//     const [isOpen, setIsOpen] = useState(false)
//     const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
//     const [isLoading, setIsLoading] = useState(false)
//     const [selectedIndex, setSelectedIndex] = useState(-1)
//
//     // Refs
//     const inputRef = useRef<HTMLInputElement>(null)
//     const containerRef = useRef<HTMLDivElement>(null)
//
//     // Debounced search query
//     const debouncedQuery = useDebounce(query, 300)
//
//     // Get initial search query from URL
//     useEffect(() => {
//         const searchQuery = searchParams.get('q') || ''
//         setQuery(searchQuery)
//     }, [searchParams])
//
//     // Fetch suggestions when debounced query changes
//     useEffect(() => {
//         if (debouncedQuery.length > 2 && showSuggestions) {
//             fetchSuggestions(debouncedQuery)
//         } else {
//             setSuggestions([])
//             setIsLoading(false)
//         }
//     }, [debouncedQuery, showSuggestions])
//
//     // Close suggestions when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//                 setIsOpen(false)
//             }
//         }
//
//         document.addEventListener('mousedown', handleClickOutside)
//         return () => document.removeEventListener('mousedown', handleClickOutside)
//     }, [])
//
//     // Mock fetch suggestions function - replace with actual API call
//     const fetchSuggestions = async (searchQuery: string) => {
//         setIsLoading(true)
//
//         try {
//             // Mock suggestions - replace with actual API call
//             await new Promise(resolve => setTimeout(resolve, 200))
//
//             const mockSuggestions: SearchSuggestion[] = [
//                 { id: '1', title: `${searchQuery} sofa`, type: 'product' as const, handle: 'modern-sofa' },
//                 { id: '2', title: `${searchQuery} chair`, type: 'product' as const, handle: 'dining-chair' },
//                 { id: '3', title: `${searchQuery} table`, type: 'product' as const, handle: 'coffee-table' },
//                 { id: '4', title: 'Living Room', type: 'category' as const, handle: 'living-room' },
//                 { id: '5', title: 'Modern Collection', type: 'collection' as const, handle: 'modern' },
//             ].filter(item =>
//                 item.title.toLowerCase().includes(searchQuery.toLowerCase())
//             ).slice(0, 5)
//
//             setSuggestions(mockSuggestions)
//         } catch (error) {
//             console.error('Failed to fetch suggestions:', error)
//             setSuggestions([])
//         } finally {
//             setIsLoading(false)
//         }
//     }
//
//     // Handle input change
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value
//         setQuery(value)
//         setSelectedIndex(-1)
//         setIsOpen(value.length > 0)
//     }
//
//     // Handle search submission
//     const handleSearch = (searchQuery: string = query) => {
//         if (!searchQuery.trim()) return
//
//         const params = new URLSearchParams(searchParams)
//         params.set('q', searchQuery.trim())
//
//         router.push(`${pathname}?${params.toString()}`)
//         setIsOpen(false)
//         inputRef.current?.blur()
//     }
//
//     // Handle suggestion selection
//     const handleSuggestionClick = (suggestion: SearchSuggestion) => {
//         if (suggestion.type === 'product') {
//             router.push(`/products/${suggestion.handle}`)
//         } else if (suggestion.type === 'category') {
//             const params = new URLSearchParams(searchParams)
//             params.set('category', suggestion.handle || suggestion.title.toLowerCase())
//             router.push(`${pathname}?${params.toString()}`)
//         } else if (suggestion.type === 'collection') {
//             const params = new URLSearchParams(searchParams)
//             params.set('collection', suggestion.handle || suggestion.title.toLowerCase())
//             router.push(`${pathname}?${params.toString()}`)
//         }
//
//         setQuery(suggestion.title)
//         setIsOpen(false)
//         inputRef.current?.blur()
//     }
//
//     // Handle keyboard navigation
//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (!isOpen || suggestions.length === 0) {
//             if (e.key === 'Enter') {
//                 handleSearch()
//             }
//             return
//         }
//
//         switch (e.key) {
//             case 'ArrowDown':
//                 e.preventDefault()
//                 setSelectedIndex(prev =>
//                     prev < suggestions.length - 1 ? prev + 1 : 0
//                 )
//                 break
//             case 'ArrowUp':
//                 e.preventDefault()
//                 setSelectedIndex(prev =>
//                     prev > 0 ? prev - 1 : suggestions.length - 1
//                 )
//                 break
//             case 'Enter':
//                 e.preventDefault()
//                 if (selectedIndex >= 0) {
//                     handleSuggestionClick(suggestions[selectedIndex])
//                 } else {
//                     handleSearch()
//                 }
//                 break
//             case 'Escape':
//                 setIsOpen(false)
//                 inputRef.current?.blur()
//                 break
//         }
//     }
//
//     // Get suggestion icon based on type
//     const getSuggestionIcon = (type: SearchSuggestion['type']) => {
//         switch (type) {
//             case 'product':
//                 return (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                     </svg>
//                 )
//             case 'category':
//                 return (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                     </svg>
//                 )
//             case 'collection':
//                 return (
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                     </svg>
//                 )
//             default:
//                 return null
//         }
//     }
//
//     return (
//         <div ref={containerRef} className={clsx('relative', className)}>
//             {/* Search Input */}
//             <div className="relative">
//                 <input
//                     ref={inputRef}
//                     type="text"
//                     value={query}
//                     onChange={handleInputChange}
//                     onKeyDown={handleKeyDown}
//                     onFocus={() => setIsOpen(query.length > 0)}
//                     placeholder={placeholder || 'Search products, categories...'}
//                     className="w-full px-4 py-3 pl-12 pr-12 text-sm bg-white border border-grayscale-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nxl-gold focus:border-nxl-gold transition-all duration-200"
//                     aria-label="Search products"
//                     aria-expanded={isOpen}
//                     aria-haspopup="listbox"
//                     aria-autocomplete="list"
//                 />
//
//                 {/* Search Icon */}
//                 <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                     <svg className="w-5 h-5 text-grayscale-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                 </div>
//
//                 {/* Clear/Loading Button */}
//                 <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
//                     {isLoading ? (
//                         <div className="w-5 h-5 border-2 border-nxl-gold border-t-transparent rounded-full animate-spin"></div>
//                     ) : query ? (
//                         <button
//                             onClick={() => {
//                                 setQuery('')
//                                 setIsOpen(false)
//                                 inputRef.current?.focus()
//                             }}
//                             className="w-5 h-5 text-grayscale-400 hover:text-grayscale-600 transition-colors"
//                             aria-label="Clear search"
//                         >
//                             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     ) : null}
//                 </div>
//             </div>
//
//             {/* Suggestions Dropdown */}
//             {isOpen && showSuggestions && (
//                 <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-grayscale-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
//                     {isLoading && (
//                         <div className="p-4 text-center text-grayscale-500">
//                             <div className="inline-flex items-center">
//                                 <div className="w-4 h-4 border-2 border-nxl-gold border-t-transparent rounded-full animate-spin mr-2"></div>
//                                 Searching...
//                             </div>
//                         </div>
//                     )}
//
//                     {!isLoading && suggestions.length === 0 && query.length > 2 && (
//                         <div className="p-4 text-center text-grayscale-500">
//                             No suggestions found
//                         </div>
//                     )}
//
//                     {!isLoading && suggestions.length > 0 && (
//                         <ul role="listbox" className="py-2">
//                             {suggestions.map((suggestion, index) => (
//                                 <li
//                                     key={suggestion.id}
//                                     role="option"
//                                     aria-selected={selectedIndex === index}
//                                     className={clsx(
//                                         'px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors',
//                                         selectedIndex === index
//                                             ? 'bg-nxl-gold/10 text-nxl-gold'
//                                             : 'hover:bg-grayscale-50 text-grayscale-700'
//                                     )}
//                                     onClick={() => handleSuggestionClick(suggestion)}
//                                 >
//                                     <div className="flex-shrink-0">
//                                         {getSuggestionIcon(suggestion.type)}
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <div className="font-medium truncate">
//                                             {suggestion.title}
//                                         </div>
//                                         <div className="text-xs text-grayscale-500 capitalize">
//                                             {suggestion.type}
//                                         </div>
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//
//                     {/* Search all button */}
//                     {query.trim() && (
//                         <div className="border-t border-grayscale-200 p-2">
//                             <button
//                                 onClick={() => handleSearch()}
//                                 className="w-full p-2 text-left text-sm text-nxl-gold hover:bg-nxl-gold/10 rounded transition-colors flex items-center gap-2"
//                             >
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                                 Search all for "{query}"
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }
//
// export default SearchBar 