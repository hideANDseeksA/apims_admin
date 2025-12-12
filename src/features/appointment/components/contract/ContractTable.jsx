import { use, useEffect, useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton
} from "mantine-react-table";

import {
  Box,
  Button,
  Flex,
  Modal,
  Text,
    TextInput,
} from "@mantine/core";

import axios from "axios";
import { Label } from "@/components/ui/label";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AddContract from "./AddContract";
import EditContract from "./EditContract";
import API from "@/api/axios";

const ContractTable = () => {
  const [contracts, setContracts] = useState([]);
  const [opened, setOpened] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [addOpened, setAddOpened] = useState(false);
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [workstations, setWorkstations] = useState([]);
  const [selectedWorkstation, setSelectedWorkstation] = useState("");
  const [formData, setFormData] = useState({
    employee_id: "",
    position_id: "",
    workstation: "",
    status: "",
    salary: "",
    start_date: "",
    end_date: "",
    id: null,
    file: null,
  });
const [totalCount, setTotalCount] = useState(0);

const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 5, // default rows per page
});

const [editOpened, setEditOpened] = useState(false);
const [editingContract, setEditingContract] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

   const fetchContracts = async () => {
  try {
    const page = pagination.pageIndex + 1; // MRT is 0-based
    const limit = pagination.pageSize;

    const res = await API.get(
      `/contracts/paginated?page=${page}&limit=${limit}`
    );

    setContracts(res.data.results || []);
    setTotalCount(res.data.total_records || res.data.results?.length || 0);
  } catch (error) {
    console.error("Error fetching contracts:", error);
  }
};


    const fetchPositions = async () => {
      try {
        const res = await axios.get(`${API_URL}/position/all`);
        const formatted = res.data.map((pos) => ({
          value: pos.id,
          label: pos.position,
        }));
        setPositions(formatted);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

const fetchWorkstations = async () => {
  try {
    const res = await axios.get(`${API_URL}/workstation/all`);
    console.log(res.data.data);
    const formatted = (res.data.data || []).map((ws) => ({
      value: ws.workstation_id,
      label: ws.workstation_name,
    }));

    setWorkstations(formatted);

  } catch (error) {
    console.error("Error fetching workstations:", error);
  }
};


  useEffect(() => {
 

    fetchContracts();
    fetchPositions();
    fetchWorkstations();
  }, []);

useEffect(() => {
  fetchContracts();
}, [pagination.pageIndex, pagination.pageSize]);

  const handleViewFile = (url) => {
    setFileUrl(url);
    setOpened(true);
  };

  const handleEditClick = (contract) => {
  setEditingContract(contract);
  setFormData({
    employee_id: contract.employer_id || "",
    employee_name: `${contract.f_name} ${contract.m_name || ""} ${contract.l_name}`.trim(),
    position_id: contract.position_id || "",
    workstation: contract.workstation_id || "",
    status: contract.status || "",
    salary: contract.salary || "",
    start_date: contract.start_date || "",
    end_date: contract.end_date || "",
    id: contract.employee_id || "",
    file_path: contract.file_path || "",
    file: null,
  });
  setSelectedPosition(contract.position_id || "");
  setSelectedWorkstation(contract.workstation_id || "");
  setEditOpened(true);
};

const handleEditContract = async () => {
  try {
    const fd = new FormData();
    fd.append("contract_id", editingContract.id);
    fd.append("employee_id", formData.id);
    fd.append("position_id", formData.position_id);
    fd.append("workstation", formData.workstation);
    fd.append("status", formData.status);
    fd.append("salary", formData.salary);
    fd.append("start_date", formData.start_date);
    fd.append("end_date", formData.end_date);
    fd.append("file_path", formData.file_path);
   if (formData.file) {
      fd.append("file", formData.file);
    } else {
 
    }

    await axios.put(`${API_URL}/contracts/${editingContract.id}`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });


    setEditOpened(false);
    setEditingContract(null);
    fetchContracts();
  } catch (err) {
    console.log("Error editing contract:", err);
  }
};

  const handleDelete = async (contract_id) => {
      if (!confirm("Are you sure you want to delete this contract?")) return;
    
      try {
        await axios.delete(`${API_URL}/contracts/${contract_id}`);
        fetchContracts();
      } catch (error) {
        console.error("Delete error:", error);
      }
    };

  // --- MRT COLUMN DEFINITIONS ---
  const columns = useMemo(
    () => [
{
      accessorFn: (row) => `${row.f_name} ${row.m_name || ""} ${row.l_name}`, 
      id: "full_name", 
      header: "Full Name",
      enableColumnFilter: true,
      filterVariant: "text",
    },
      {
        accessorKey: "position_name",
        header: "Position",
        enableColumnFilter: true,
        filterVariant: "text",
      },
      {
        accessorKey: "workstation_name",
        header: "Workstation",
        enableColumnFilter: true,
        filterVariant: "text",
      },
      {
        accessorKey: "status",
        header: "Status",
        filterVariant: "select",
      },
      {
        accessorKey: "salary",
        header: "Salary",
        filterVariant: "range",
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        filterVariant: "date-range",
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        filterVariant: "date-range",
      },
      {
        id: "signed_url",
        header: "File",
        Cell: ({ row }) => (
          <Button
            size="xs"
            variant="light"
            disabled={!row.original.signed_url}
            onClick={() => handleViewFile(row.original.signed_url)}
            
          >
            View
          </Button>
        ),
      },
        {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <Flex gap="xs">
          <Button
            size="xs"
            variant="light"
            color="blue"
            onClick={() => handleEditClick(row.original)}
          >
            Edit
          </Button>
               <Button
            size="xs"
            variant="light"
            color="red"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </Flex>
      ),
    },
    ],
    []
  );

const table = useMantineReactTable({
  columns,
  data: contracts,

  // server-side mode
  manualPagination: true,
  rowCount: totalCount,

  enablePagination: true,

  onPaginationChange: setPagination,
  state: { pagination },

  initialState: {
    pagination: { pageSize: 4, pageIndex: 0 },
    showGlobalFilter: true,
  },

  renderTopToolbar: ({ table }) => (
    <Flex p="md" justify="space-between">
      <Flex gap="xs">
        <MRT_GlobalFilterTextInput table={table} />
        <MRT_ToggleFiltersButton table={table} />
      </Flex>
      <Button
        color="green"
        onClick={() => {
          setAddOpened(true);
          fetchPositions();
          fetchWorkstations();
        }}
      >
        + Add Contract
      </Button>
    </Flex>
  ),
});

  return (
    <>
      {/* FILE PREVIEW MODAL */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="90%"
        centered
        title="Contract File Viewer"
      >
        {fileUrl ? (
          <iframe
            src={fileUrl}
            style={{ width: "100%", height: "600px", border: "none" }}
          />
        ) : (
          <Text>No file available.</Text>
        )}
      </Modal>

      <Dialog open={addOpened} onOpenChange={setAddOpened}>
        <AddContract
          open={addOpened}
          onOpenChange={setAddOpened}
          positions={positions}
          workstations={workstations}
          fetchContracts={fetchContracts}
          fetchPositions={fetchPositions}
          fetchWorkstations={fetchWorkstations}
          API_URL={API_URL}
        />
      </Dialog>

      {/* EDIT CONTRACT DIALOG */}
    <Dialog open={editOpened} onOpenChange={setEditOpened}>
      <EditContract
        open={editOpened}
        onOpenChange={setEditOpened}
        contract={editingContract}
        positions={positions}
        workstations={workstations}
        fetchContracts={fetchContracts}
        API_URL={API_URL}
      />
    </Dialog>


      <MantineReactTable table={table} />
    </>
  );
};

export default ContractTable;
