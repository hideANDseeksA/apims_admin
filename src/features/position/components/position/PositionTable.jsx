import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import { IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';
import { Flex, Button } from "@mantine/core";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";



const API_URL = import.meta.env.VITE_API_URL;

const PositionTable = () => {
  const [positionData, setPositionData] = useState([]);
  const [salaryGrade, setSalaryGrade] = useState([]); // tranches

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null); // object or null
  const [selectedSalaryGrade, setSelectedSalaryGrade] = useState(""); // tranche id
  const fileInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    position: "",
    classification: "",
    salary_grade: "", // will hold tranche id when saving
  });

  // Fetch positions
  const fetchPositions = async () => {
    try {
      const res = await API.get(`/position/all`);
      setPositionData(res.data || []);
    } catch (err) {
      console.error("Error fetching positions:", err);
    }
  };

  // Fetch salary tranches
  const fetchSalaryGrades = async () => {
    try {
      const res = await axios.get(`${API_URL}/salary_tranches`);
      setSalaryGrade(res.data || []);
    } catch (err) {
      console.error("Error fetching salary tranches:", err);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchSalaryGrades();
  }, []);

  // ------------------------------
  // Open / Close Dialogs
  // ------------------------------
  const openAddDialog = () => {
    setEditingPosition(null);
    setFormData({
      position: "",
      classification: "",
      salary_grade: "",
    });
    setSelectedSalaryGrade("");
    setOpenDialog(true);
  };

  const openEditDialog = (position) => {
    // map tranche id (prefer id) — fallback: match by salary_grade number
    let trancheId = position?.tranche?.id || "";

    if (!trancheId && position?.tranche?.salary_grade) {
      const matched = salaryGrade.find(
        (g) => String(g.salary_grade) === String(position.tranche.salary_grade)
      );
      if (matched) trancheId = matched.id;
    }

    setEditingPosition(position);
    setSelectedSalaryGrade(trancheId || "");
    setFormData({
      position: position.position || "",
      classification: position.classification || "",
      salary_grade: trancheId || "",
    });

    setOpenDialog(true);
  };

  // ------------------------------
  // Form handlers
  // ------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setSelectedSalaryGrade(value);
    setFormData((prev) => ({ ...prev, salary_grade: value }));
  };

  // ------------------------------
  // CRUD
  // ------------------------------
  const handleAddPosition = async () => {
    try {
    setOpenDialog(false);
    const confirm = await showConfirm("Are you sure to add this Position?");
    if (!confirm.isConfirmed) return;
      await API.post(`/position/add`, {
        position: formData.position,
        classification: formData.classification,
        salary_grade: selectedSalaryGrade || formData.salary_grade,
      });

      await showSuccess("Position added successfully.");
      fetchPositions();
    } catch (err) {
      console.error("Add position error:", err);
    }
  };

  const handleSaveChanges = async () => {
    if (!editingPosition) return;
     setOpenDialog(false);
    const confirm = await showConfirm("Are you sure to Update this Position?");
    if (!confirm.isConfirmed) return;
       
    try {
      await API.put(`/position/update/${editingPosition.id}`, {
        position: formData.position,
        classification: formData.classification,
        // send tranche UUID (id)
        salary_grade: selectedSalaryGrade || formData.salary_grade,
      });

      await showSuccess("Position updated successfully.");
      fetchPositions();
      setEditingPosition(null);
    } catch (err) {
      console.error("Update position error:", err);
      await showError("Failed to update position.");
    }
  };

  const handleUploadCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const confirm = await showConfirm("Upload this CSV file?");
    if (!confirm.isConfirmed) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post(
        `/salary_tranches/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      await showSuccess("File uploaded successfully.");
      fetchData(); // reload table
    } catch (err) {
      console.error(err);
      await showError("File upload failed.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirm("Delete this position?");
    if (!confirm.isConfirmed) return;
    try {
      await API.delete(`/position/delete/${id}`);
      await showSuccess("Position deleted successfully.");
      fetchPositions();
    } catch (err) {
      console.error("Delete position error:", err);
      await showError("Failed to delete position.");
    }
  };

  // ------------------------------
  // Columns for MRT
  // ------------------------------
  const columns = useMemo(
    () => [
      {
        accessorKey: "position",
        header: "Position",
        enableColumnFilter: true,
      },
      {
        accessorKey: "classification",
        header: "Classification",
        enableColumnFilter: true,
      },
      {
        accessorKey: "tranche.salary_grade",
        header: "Salary Grade",
        enableColumnFilter: true,
      },
      {
        accessorKey: "tranche.step1",
        header: "Base Salary",
        Cell: ({ cell }) => `₱${Number(cell.getValue()).toLocaleString()}`,
      }
      ,
      {
        header: "Actions",
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              size="xs"
              variant="outline"
              onClick={() => openEditDialog(row.original)}
            >
              Edit
            </Button>
            <Button
              size="xs"
              color="red"
              variant="outline"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [salaryGrade]
  );

  // ------------------------------
  // Mantine React Table instance
  // ------------------------------
  const table = useMantineReactTable({
    columns,
    data: positionData,
    enableColumnFilters: true,
    enableSorting: true,
    enableGlobalFilter: true,
    enablePagination: true,
       mantineTableContainerProps: {
    style: {
      maxHeight: "calc(100vh - 100px)",   // height of scroll container
      overflowY: "auto",
      tableLayout: "auto" 
    },
  },
    initialState: {
      showGlobalFilter: true,
      pagination: { pageSize: 5 },
    },
    renderTopToolbar: ({ table }) => (
      <Flex p="md" justify="space-between" align="center">
        <Flex gap="md" align="center">
          <MRT_GlobalFilterTextInput table={table} />
          <MRT_ToggleFiltersButton table={table} />
        </Flex>

        <Flex gap="sm">
          <Button
            leftIcon={<IconPlus />}
            onClick={openAddDialog}
          >Add Position</Button>
          <Button
            color="green"
            leftIcon={<IconUpload />}
            variant="filled"
            onClick={() => {
              fileInputRef.current.value = "";
              fileInputRef.current.click()
            }}
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
        </Flex>
      </Flex>
    ),

  });

  // ------------------------------
  // Component JSX
  // ------------------------------
  return (
    <>

      <MantineReactTable table={table} />

      {/* ADD / EDIT DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
         <DialogHeader>
      <VisuallyHidden>
        <DialogTitle>{editingPosition ? "Edit Position" : "Add Position"}</DialogTitle>
      </VisuallyHidden>
    </DialogHeader>

          <div className="space-y-4 mt-3">
            <div>
              <Label>Position</Label>
              <Input name="position" value={formData.position} onChange={handleInputChange} />
            </div>

            <div>
              <Label>Classification</Label>
              {/* using your Select component for classification choices */}
              <Select
                value={formData.classification}
                onValueChange={(v) => setFormData((p) => ({ ...p, classification: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Teaching">Teaching</SelectItem>
                  <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
                  <SelectItem value="Teaching Related">Teaching Related</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Salary Grade</Label>
              <Select value={selectedSalaryGrade} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Salary Grade Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {salaryGrade.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.salary_grade}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
              {editingPosition ? (
                <Button onClick={handleSaveChanges}>Save</Button>
              ) : (
                <Button onClick={handleAddPosition}>Save</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PositionTable;
