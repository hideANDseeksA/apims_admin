import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2Icon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const EmployeeTable = ({ searchValue, department, district, position }) => {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  const [employees, setEmployees] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [totalEmployees, setTotalEmployees] = useState(0)

  // ✅ Fetch employees with server-side pagination
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${API_URL}/employee/employees-with-workstation`, {
          params: {
            page: currentPage,
            search: searchValue || '',
            department: department === 'all' ? '' : department,
            district: district === 'all' ? '' : district,
            position: position === 'all' ? '' : position,
          },
        })

        setEmployees(response.data.results || [])
        setMaxPage(response.data.max_page || 1)
        setTotalEmployees(response.data.total_records || 0)
      } catch (error) {
        console.error('❌ Failed to fetch employees:', error)
        setAlert({
          type: 'error',
          title: 'Fetch failed',
          description: 'Unable to load employee data from the server.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [currentPage, searchValue, department, district, position])

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchValue, department, district, position])

  //  Delete employee handler
  const handleDelete = async (employee) => {
    try {
      await axios.delete(`${API_URL}/employee/${employee.employee_id}`)
      setAlert({
        type: 'success',
        title: 'Employee Deleted',
        description: `Employee ${employee.f_name} ${employee.l_name} has been deleted successfully.`,
      })
      // Refresh current page after deletion
      const response = await axios.get(`${API_URL}/employee/with_workstation`, {
        params: { page: currentPage },
      })
      setEmployees(response.data.data || [])
      setMaxPage(response.data.max_page || 1)
    } catch (error) {
      console.error('❌ Delete failed:', error)
      setAlert({
        type: 'error',
        title: 'Delete failed',
        description: 'Something went wrong while deleting the employee.',
      })
    }
  }

  return (
    <>
      <Card>
        <CardTitle className="px-5 font-light mt-3">
          Employees ({totalEmployees})
        </CardTitle>

        <CardContent className="h-[55vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : employees.length > 0 ? (
                employees.map((employee, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex gap-3 items-center">
                        <Avatar>
                          <AvatarFallback>
                            {employee.f_name && employee.l_name
                              ? `${employee.f_name[0]}${employee.l_name[0]}`.toUpperCase()
                              : 'N/A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{`${employee.f_name} ${employee.l_name}`}</p>
                          <p className="text-muted-foreground text-xs md:text-sm truncate">
                            {employee.email_address}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position_name || '—'}</TableCell>
                    <TableCell>{employee.workstation_name || '—'}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        className="bg-[#F7F9F7] border border-[#7CB342] text-[#2D5A2D]"
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/employees/${employee.employee_id}`)}
                      >
                        View
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            className="bg-[#F7F9F7] border border-[#b3424b] text-[#832e35]"
                            size="sm"
                            variant="outline"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete {employee.f_name} {employee.l_name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The employee record will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(employee)}
                              className="bg-[#b3424b] text-white hover:bg-[#9a3740]"
                            >
                              Yes, delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination Section */}
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: maxPage }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, maxPage))}
                  className={currentPage === maxPage ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      {/* ✅ Alert for success/error messages */}
      {alert && (
        <div className="fixed bottom-5 right-5 z-50 w-80 animate-in fade-in-50">
          <Alert
            className={
              alert.type === 'success'
                ? 'border-green-600 bg-green-50 text-green-800'
                : 'border-red-600 bg-red-50 text-red-800'
            }
          >
            <CheckCircle2Icon className="h-5 w-5" />
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}

export default EmployeeTable
