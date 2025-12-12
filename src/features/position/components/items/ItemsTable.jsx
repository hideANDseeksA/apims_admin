import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";

import { Flex, Button } from "@mantine/core";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const API_URL = import.meta.env.VITE_API_URL;

const ItemsTable = () => {
  const [items, setItems] = useState([]);
  const [positions, setPositions] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("");

  const [formData, setFormData] = useState({
    item_id: "",
    position_id: "",
    times_tamp: "",
    availability: true,
    subtitute: false,
    remarks: "",
  });

  // ------------------------------
  // Fetch Data
  // ------------------------------
  const fetchPositions = async () => {
    try {
      const res = await API.get(`/position/all`);
      const formatted = res.data.map((pos) => ({
        value: pos.id,
        label: pos.position,
      }));
      setPositions(formatted);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await API.get(`/ItemTable/all`);
      setItems(res.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ------------------------------
  // Open Dialogs
  // ------------------------------
  const openAddDialog = () => {
    fetchPositions();
    setEditingId(null);

    setSelectedPosition("");
    setFormData({
      item_id: "",
      position_id: "",
      times_tamp: "",
    });

    setOpenDialog(true);
  };

  const openEditDialog = (item) => {
    fetchPositions();
    setEditingId(item.id);

    setSelectedPosition(item.position?.id || "");

    setFormData({
      item_id: item.item_id,
      position_id: item.position?.id || "",
      times_tamp: item.times_tamp || "",
      availability: item.availability,
      subtitute: item.subtitute,
      remarks: item.remarks,
    });

    setOpenDialog(true);
  };

  // ------------------------------
  // Form Handlers
  // ------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------------------
  // CRUD
  // ------------------------------
  const handleAddItem = async () => {
    setOpenDialog(false);
    const confirm = await showConfirm("Are you sure to add this item?");
    if (!confirm.isConfirmed) return;
    try {
      await API.post(`/ItemTable`, {
        item_id: formData.item_id,
        position_id: selectedPosition,
        times_tamp: formData.times_tamp,
      });
     await showSuccess("Item added successfully.");
      fetchItems();
      
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const handleUpdateItem = async () => {
    setOpenDialog(false);
    const confirm = await showConfirm("Are you sure to Update this item?");
    if (!confirm.isConfirmed) return;
    
    try {
      await API.put(`/ItemTable/${editingId}`, {
        item_id: formData.item_id,
        position_id: selectedPosition,
        times_tamp: formData.times_tamp,
        availability: formData.availability,
        subtitute: formData.subtitute,
        remarks: formData.remarks,
      });
      await showSuccess("Item updated succesfully.")
      fetchItems();
      
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirm("Are you sure to delete this item?");
    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/ItemTable/${id}`);
      await showSuccess("Item deleted succesfully")
      fetchItems();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ------------------------------
  // Table Columns
  // ------------------------------
  const columns = useMemo(
    () => [
      {
        accessorKey: "position.position",
        header: "Position",
      },
      {
        accessorKey: "item_id",
        header: "Plantilla No.",
      },
      {
        accessorKey: "availability",
        header: "Availability",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <span style={{ color: "green", fontWeight: "600" }}>Available</span>
          ) : (
            <span style={{ color: "red", fontWeight: "600" }}>Unavailable</span>
          ),
      },
      {
        accessorKey: "position.tranche.salary_grade",
        header: "Salary Grade",
      },
      {
        accessorKey: "times_tamp",
        header: "Date Released",
      },
      {
        header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Button size="xs" variant="outline" onClick={() => openEditDialog(row.original)}>
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
    []
  );

  const table = useMantineReactTable({
    columns,
    data: items,
    enableColumnFilters: true,
    enableSorting: true,
    enableGlobalFilter: true,
    enablePagination: true,
    initialState: {
      showGlobalFilter: true,
      pagination: { pageSize: 10 },
    },

    renderTopToolbar: ({ table }) => (
      <Flex p="md" justify="space-between" align="center">
        <Flex gap="md" align="center">
          <MRT_GlobalFilterTextInput table={table} />
          <MRT_ToggleFiltersButton table={table} />
        </Flex>

        <Button onClick={openAddDialog}>Add Item</Button>
      </Flex>
    ),
  });

  // ------------------------------
  // DIALOG UI
  // ------------------------------
  return (
    <>

      <MantineReactTable table={table} />



      {/* ADD / EDIT Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Item" : "Add Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* POSITION */}
            <div>
              <Label>Position</Label>
              <SearchableDropdown
                items={positions}
                value={selectedPosition}
                onChange={setSelectedPosition}
              />
            </div>

            {/* ITEM ID */}
            <div>
              <Label>Item ID</Label>
              <Input
                name="item_id"
                value={formData.item_id}
                onChange={handleInputChange}
              />
            </div>

            {/* DATE RELEASED */}
            <div>
              <Label>Date Released</Label>
              <Input
                type="date"
                name="times_tamp"
                value={formData.times_tamp}
                onChange={handleInputChange}
              />
            </div>

            {/* -------------------------- */}
            {/* SHOW EXTRA FIELDS ONLY ON EDIT */}
            {/* -------------------------- */}
            {editingId && (
              <>
                <div>
                  <Label>Availability</Label>
                  <select
                    name="availability"
                    value={formData.availability ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: e.target.value === "true",
                      }))
                    }
                    className="border p-2 w-full rounded"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>

                <div>
                  <Label>Substitute</Label>
                  <select
                    name="subtitute"
                    value={formData.subtitute ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subtitute: e.target.value === "true",
                      }))
                    }
                    className="border p-2 w-full rounded"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <Label>Remarks</Label>
                  <Input
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* FOOTER BUTTONS */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>

            {editingId ? (
              <Button onClick={handleUpdateItem}>Update</Button>
            ) : (
              <Button onClick={handleAddItem}>Save</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemsTable;
