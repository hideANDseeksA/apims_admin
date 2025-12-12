import { useMemo, useEffect, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import { Box, Button, Flex, Menu, Text } from "@mantine/core";
import axios from "axios";
import API from "@/api/axios";
const RetirementTable = () => {
  const [retirementData, setRetirementData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");


  const fetchRetirements = async () => {
    try {
      const page = pagination.pageIndex + 1; // MRT is 0-based
      const limit = pagination.pageSize;

      const res = await API.get(`retirement/`, {
        params: {
          page,
          limit,
          search: globalFilter,
        },
      });

      setRetirementData(res.data.data || []);
      setTotalRecords(res.data.total_count || res.data.data?.length || 0);
    } catch (error) {
      console.error("Error fetching retirement data:", error);
    }
  };

  useEffect(() => {
    fetchRetirements();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter]);

  const columns = useMemo(
    () => [
      {
        header: "Employee",
        accessorFn: (row) =>
          `${row.f_name} ${row.m_name ? row.m_name + "." : ""} ${row.l_name}`,
        id: "employee",
        size: 250,
        Cell: ({ row }) => (
          <Flex align="center" gap="sm">
            <Box
              sx={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text size="sm" weight={500}>
                {row.original.f_name[0]}
                {row.original.l_name[0]}
              </Text>
            </Box>
            <Box>
              <Text>
                {row.original.f_name}{" "}
                {row.original.m_name ? row.original.m_name + ". " : ""}{" "}
                {row.original.l_name}
              </Text>
              <Text size="xs" c="dimmed">
                {row.original.email_address}
              </Text>
            </Box>
          </Flex>
        ),
      },
      { accessorKey: "employer_id", header: "Employer ID" },
      { accessorKey: "full_age", header: "Age" },
      { accessorKey: "birth_date", header: "Birth Date" },
      { accessorKey: "remarks", header: "Remarks" },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: retirementData,

    // SERVER-SIDE MODE
    manualPagination: true,
    rowCount: totalRecords,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: { pagination, globalFilter },

    // FEATURES
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableColumnFilterModes: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableColumnActions: false,
    enableRowVirtualization: true,

    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      showGlobalFilter: true,
    },

    mantineSearchTextInputProps: { placeholder: "Search Employees" },
  
  mantineTableContainerProps: {
    style: {
      maxHeight: "calc(100vh - 200px)", // adjust scroll height
      overflowY: "auto",
      borderRadius: "10px",
      border: "1px solid #e5e7eb",
    },
  },
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item onClick={() => alert("Profile: " + row.original.f_name)}>
          View Profile
        </Menu.Item>
        <Menu.Item
          onClick={() => alert("Email: " + row.original.email_address)}
        >
          Send Email
        </Menu.Item>
      </>
    ),

    renderTopToolbar: ({ table }) => {
      const selected = table.getSelectedRowModel().flatRows;
      const handleAction = (type) => {
        selected.forEach((row) => {
          alert(`${type}: ${row.getValue("employee")}`);
        });
      };

      return (
        <Flex justify="space-between" p="md">
          <Flex gap="xs">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Flex>
          <Flex gap="xs">
            <Button
              color="red"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={() => handleAction("Deactivate")}
            >
              Deactivate
            </Button>
            <Button
              color="green"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={() => handleAction("Activate")}
            >
              Activate
            </Button>
            <Button
              color="blue"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={() => handleAction("Contact")}
            >
              Contact
            </Button>
          </Flex>
        </Flex>
      );
    },
  });

  return (
    <Box>
      <MantineReactTable table={table} />
    </Box>
  );
};

export default RetirementTable;
