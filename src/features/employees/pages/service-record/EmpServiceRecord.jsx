"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import AddServiceRecords from "./AddServiceRecord"
import EditServiceRecords from "./EditServiceRecord"
import { showSuccess, showConfirm } from "@/utils/alerts"
import API from "@/api/axios"
import {
  ArrowLeft,
  Plus,
  Download,
  Pencil,
  Trash2,
} from "lucide-react"
import APIV2 from "@/api/axiosv2"

const EmpServiceRecord = () => {
  const { employee_id } = useParams()
  const navigate = useNavigate()

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const [addOpened, setAddOpened] = useState(false)
  const [editOpened, setEditOpened] = useState(false)
  const [selectedServiceRecord, setSelectedServiceRecord] = useState(null)

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const loadRecords = async () => {
    try {
      const res = await APIV2.get(
        `/service_records/employee/${employee_id}`
      )
      setRecords(Array.isArray(res.data) ? res.data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [employee_id])

  const handleEdit = (record) => {
    setSelectedServiceRecord(record)
    setEditOpened(true)
  }

  const handleDelete = async (service_id) => {
    const confirm = await showConfirm(
      "Are you sure to delete this Service Record?"
    )
    if (!confirm.isConfirmed) return

    await API.delete(`/service_records/delete/${service_id}`)
    await loadRecords()
    await showSuccess("Service Record deleted successfully.")
  }

  const downloadServiceRecord = async () => {
    const response = await API.get(
      `/generator/service-records/${employee_id}`,
      { responseType: "blob" }
    )

    let filename = "service_records.xlsx"
    const disposition = response.headers["content-disposition"]

    if (disposition) {
      const match = disposition.match(/filename="?([^"]+)"?/)
      if (match?.[1]) filename = match[1]
    }

    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()

    window.URL.revokeObjectURL(url)
  }

  const columns = [
    { accessorKey: "date_from", header: "Date From" },
    {
      accessorKey: "date_to",
      header: "Date To",
      cell: ({ row }) => row.original.date_to || "Present",
    },
    { accessorKey: "salary", header: "Salary" },
    { accessorKey: "branch", header: "Branch" },
    { accessorKey: "cause", header: "Cause" },
    { accessorKey: "position_name", header: "Service Record" },
    { accessorKey: "workstation_name", header: "Workstation" },
    { accessorKey: "employment_status", header: "Status" },
    { accessorKey: "leave_pay", header: "Leave Pay" },
    {
      accessorKey: "position_classification",
      header: "Classification",
    },
{
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="outline"
        onClick={() => handleEdit(row.original)}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        size="icon"
        variant="destructive"
        onClick={() =>
          handleDelete(row.original.service_id)
        }
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ),
}

  ]

  const table = useReactTable({
    data: records,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

if (loading)
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>

        {/* Loading text */}
        <span className="text-gray-600 font-medium">Loading service record data...</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
<div className="flex justify-between items-center">
  <Button
    variant="outline"
    onClick={() => navigate(`/employees/${employee_id}`)}
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    Back
  </Button>

  <div className="flex gap-2">
    <Button onClick={downloadServiceRecord}>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>

    <Button onClick={() => setAddOpened(true)}>
      <Plus className="mr-2 h-4 w-4" />
      Create Records
    </Button>
  </div>
</div>


      <Card>
        <CardHeader>
          <CardTitle>Service Records</CardTitle>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="Filter by start date..."
            value={
              table.getColumn("date_from")?.getFilterValue() ?? ""
            }
            onChange={(e) =>
              table
                .getColumn("date_from")
                ?.setFilterValue(e.target.value)
            }
            className="max-w-sm mb-4"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={addOpened} onOpenChange={setAddOpened}>
        <AddServiceRecords
          open={addOpened}
          employees_id={employee_id}
          onOpenChange={setAddOpened}
          reloadRecords={loadRecords}
        />
      </Dialog>

      <Dialog open={editOpened} onOpenChange={setEditOpened}>
        <EditServiceRecords
          open={editOpened}
          servicerecord={selectedServiceRecord}
          onOpenChange={setEditOpened}
          reloadRecords={loadRecords}
        />
      </Dialog>
    </div>
  )
}

export default EmpServiceRecord
