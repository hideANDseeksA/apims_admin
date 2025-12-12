import { useEffect, useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import { Button, Flex } from "@mantine/core";
import axios from "axios";
import { Dialog } from "@/components/ui/dialog";

import AddServiceRecords from "./AddServiceRecord";
import EditServiceRecords from "./EditServiceRecord";
import API from "@/api/axios";


const ServiceRecordTable = () => {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [selectedServiceRecord, setSelectedServiceRecord] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  // MRT STATE
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // ✅ API FETCH (FULL SERVER CONTROL)
  const fetchServiceRecords = async () => {
  try {
    const params = {
      page: pagination.pageIndex + 1, // Mantine → API
      limit: pagination.pageSize,
    };

    const res = await API.get(
      `/service_records/paginated`,
      { params }
    );

    setServiceRecords(res.data.results || []);
    setTotalCount(res.data.total_count || 0); // ✅ FIXED
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  useEffect(() => {
    fetchServiceRecords();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  const handleDelete = async (service_id) => {
    if (!confirm("Delete this service record?")) return;
    try {
      await API.delete(
        `/service_records/delete/${service_id}`
      );
      fetchServiceRecords();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ✅ COLUMNS
  const columns = useMemo(
    () => [
      { accessorKey: "employer_id", header: "Employee ID" },
      {
        accessorFn: (row) =>
          `${row.employee_f_name} ${row.employee_m_name || ""} ${row.employee_l_name}`.trim(),
        id: "full_name",
        header: "Full Name",
      },
      { accessorKey: "position_name", header: "Position" },
      { accessorKey: "workstation_name", header: "Workstation" },
      { accessorKey: "employment_status", header: "Status" },
      { accessorKey: "salary", header: "Salary" },
      { accessorKey: "date_from", header: "Start Date" },
      { accessorKey: "date_to", header: "End Date", 
        Cell: ({ cell }) => cell.getValue() || "Present"
      },
      { accessorKey: "branch", header: "Branch" },
      {
        accessorKey: "cause",
        header: "Cause",
        Cell: ({ cell }) => cell.getValue() || "---",
      },
      { accessorKey: "identifier", header: "Source" },
      { accessorKey: "leave_pay", header: "Leave Pay" },
      { accessorKey:"active", header:"In Use" ,
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
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
              onClick={() => {
                setSelectedServiceRecord(row.original);
                setEditOpened(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => handleDelete(row.original.service_id)}
            >
              Delete
            </Button>
          </Flex>
        ),
      },
    ],
    []
  );

  // ✅ MRT CONFIG
  const table = useMantineReactTable({
    columns,
    data: serviceRecords,

    manualPagination: true,

    rowCount: totalCount,
      mantineTableContainerProps: {
    style: {
      maxHeight: "calc(100vh - 200px)",   // height of scroll container
      overflowY: "auto",
      tableLayout: "auto" 
    },
  },

    onPaginationChange: setPagination,


    state: {
      pagination
    },

    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
      showGlobalFilter: true,
    },
  defaultColumn: {
    minSize: 20,
    size: "auto",
    maxSize: Number.MAX_SAFE_INTEGER,
  },
    
    renderTopToolbar: ({ table }) => (
      <Flex p="md" justify="space-between">
        <Flex gap="xs">
          <MRT_GlobalFilterTextInput table={table} />
          <MRT_ToggleFiltersButton table={table} />
        </Flex>
        <Button color="green" onClick={() => setAddOpened(true)}>
          + Add Service Record
        </Button>
      </Flex>
    ),
  });

  return (
    <>
      {/* ADD */}
      <Dialog open={addOpened} onOpenChange={setAddOpened}>
        <AddServiceRecords
          open={addOpened}
          onOpenChange={setAddOpened}
          fetchServiceRecords={fetchServiceRecords}
          API_URL={API_URL}
        />
      </Dialog>

      {/* EDIT */}
      <Dialog open={editOpened} onOpenChange={setEditOpened}>
        <EditServiceRecords
          open={editOpened}
          onOpenChange={setEditOpened}
          servicerecord={selectedServiceRecord}
          fetchServiceRecords={fetchServiceRecords}
          API_URL={API_URL}
        />
      </Dialog>

      <MantineReactTable table={table} />
    </>
  );
};

export default ServiceRecordTable;
