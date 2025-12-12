import React, { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MantineReactTable, useMantineReactTable } from "mantine-react-table"
import { Box, Button } from '@mantine/core';
import { IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import API from "@/api/axios"
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const SalaryTranche = () => {
  const [data, setData] = useState([])
  // Delete salary grade
  const handleDelete = async (row) => {
    const confirm = await showConfirm("Are you sure to delete this Salary Grade?");
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/salary_tranches/${row.id}`);

      await showSuccess("Salay Grade deleted successfully.")
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete salary grade.");
    }
  }

  const [error, setError] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const fileInputRef = React.useRef(null);

  const [newGrade, setNewGrade] = useState({
    salary_grade: "",
    step1: "",
    step2: "",
    step3: "",
    step4: "",
    step5: "",
    step6: "",
    step7: "",
    step8: "",
    code: "",
  })

  const API_URL = import.meta.env.VITE_API_URL

  // Fetch salary data
  const fetchData = async () => {
    try {
      const res = await API.get(`/salary_tranches/`)
      setData(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch salary tranches.")
    } finally {
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    if (isEditOpen) {
      setSelectedRow((prev) => ({ ...prev, [name]: value }))
    } else {
      setNewGrade((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsDialogOpen(false)
    const confirm = await showConfirm("Are you sure to add this Salary Grade?");
    if (!confirm.isConfirmed) return;

    try {
      const payload = {
        salary_grade: Number(newGrade.salary_grade),
        step1: Number(newGrade.step1),
        step2: Number(newGrade.step2),
        step3: Number(newGrade.step3),
        step4: Number(newGrade.step4),
        step5: Number(newGrade.step5),
        step6: Number(newGrade.step6),
        step7: Number(newGrade.step7),
        step8: Number(newGrade.step8),
        code: newGrade.code,
      }

      await API.post(`/salary_tranches/add`, payload)
    
      setNewGrade({
        salary_grade: "",
        step1: "",
        step2: "",
        step3: "",
        step4: "",
        step5: "",
        step6: "",
        step7: "",
        step8: "",
        code: "",
      })

      await showSuccess("Salary Grade added succesfully.")
      fetchData()
    } catch (err) {
      console.error(err)
   
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
        setIsEditOpen(false)
        const confirm = await showConfirm("Are you sure to update this Salary Grade?");
    if (!confirm.isConfirmed) return;
    try {
      const payload = {
        salary_grade: Number(selectedRow.salary_grade),
        step1: Number(selectedRow.step1),
        step2: Number(selectedRow.step2),
        step3: Number(selectedRow.step3),
        step4: Number(selectedRow.step4),
        step5: Number(selectedRow.step5),
        step6: Number(selectedRow.step6),
        step7: Number(selectedRow.step7),
        step8: Number(selectedRow.step8),
        code: selectedRow.code,
      }

      await API.put(`/salary_tranches/${selectedRow.id}`, payload)

      await showSuccess("Salary Grade updated successfully");
  
      setSelectedRow(null)
      fetchData()
    } catch (err) {
      console.error(err)
      alert("Failed to update salary grade.")
    }
  }

  // MantineReactTable columns
  const columns = useMemo(() => [
    {
      accessorKey: "salary_grade",
      header: "Salary Grade",
    },
    ...Array.from({ length: 8 }, (_, i) => ({
      accessorKey: `step${i + 1}`,
      header: `Step ${i + 1}`,
      Cell: ({ cell }) => `₱${Number(cell.getValue()).toLocaleString()}`,
    })),
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button size="sm" variant="outline" onClick={() => {
            setSelectedRow(row.original);
            setIsEditOpen(true);
          }}>Edit</Button>
          <Button size="sm" color="red" variant="outline" onClick={() => handleDelete(row.original)}>Delete</Button>
        </div>
      ),
    },
  ], []);

  const handleUploadCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const confirm = await showConfirm("Upload this CSV file?");
    if (!confirm.isConfirmed) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post(
        `${API_URL}/salary_tranches/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      await showSuccess("File Uploaded successfully.")
      fetchData(); // reload table
    } catch (err) {
      console.error(err);
    }
  };


  // CSV export config
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    useBom: true,
  });


  const fieldsToExport = ["salary_grade", "step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "code"];
  const filteredData = data.map(item => {
    const obj = {};
    fieldsToExport.forEach(key => obj[key] = item[key]);
    return obj;
  });


  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(filteredData);
    download(csvConfig)(csv);
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: false,
    enableColumnActions: false,
    enableRowActions: false,
    enablePagination: true,
    
    
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      style: {
        maxHeight: "calc(100vh - 200px)",   // height of scroll container
        overflowY: "auto",
      },
    },
    
    defaultColumn: {
      minSize: 20,
      size: "auto",
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>

        <Button
          onClick={() => setIsDialogOpen(true)}
          leftIcon={<IconPlus />}
          variant="filled"
        >
          Add Salary Grade
        </Button>
        <Button
          color="green"
          leftIcon={<IconUpload />}
          variant="filled"
          onClick={() => {
            fileInputRef.current.value = "";
            fileInputRef.current.click()}}
        >
          Upload File
        </Button>

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          hidden
          onChange={handleUploadCSV}
        />

        <Button
          color="red"
          onClick={handleExportData}
          leftIcon={<IconDownload />}
          variant="filled"
        >
          Export All Data
        </Button>
      </Box>
    ),
  });



  return (
    <>
    <MantineReactTable table={table} style={{ minWidth: 600, width: '100%' }} />
      {/* Add Salary Grade Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Salary Grade</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="salary_grade">Salary Grade</Label>
                <Input
                  id="salary_grade"
                  name="salary_grade"
                  placeholder="e.g. 3"
                  value={newGrade.salary_grade}
                  onChange={handleChange}
                  required
                />
              </div>

              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Label htmlFor={`step${i + 1}`}>Step {i + 1}</Label>
                  <Input
                    id={`step${i + 1}`}
                    name={`step${i + 1}`}
                    placeholder="₱"
                    value={newGrade[`step${i + 1}`]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <div className="col-span-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="e.g. SG3-2025"
                  value={newGrade.code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit">Add Grade</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Salary Grade</DialogTitle>
          </DialogHeader>

          {selectedRow && (
            <form onSubmit={handleEdit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label htmlFor="salary_grade">Salary Grade</Label>
                  <Input
                    id="salary_grade"
                    name="salary_grade"
                    value={selectedRow.salary_grade}
                    onChange={handleChange}
                    required
                  />
                </div>

                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <Label htmlFor={`step${i + 1}`}>Step {i + 1}</Label>
                    <Input
                      id={`step${i + 1}`}
                      name={`step${i + 1}`}
                      value={selectedRow[`step${i + 1}`]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}

                <div className="col-span-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={selectedRow.code}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SalaryTranche
