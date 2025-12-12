import { useMemo, useEffect, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import { Box, Button, Flex, Menu, Text, TextInput } from "@mantine/core";
import API from "@/api/axios";
import EditWorkstationModal from "./EditWorkstationModal"; // import your modal

const UserManagementTable = () => {
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [searchValue, setSearchValue] = useState("");

  // Modal state
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from backend
  const fetchUsers = async (search = globalFilter) => {
    try {
      const res = await API.get("/auth/user/full-info", {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: search || "",
        },
      });

      setUsers(res.data.data || []);
      setTotalCount(res.data.total_count || 0);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(globalFilter);
  }, [pagination, globalFilter]);

  // Columns
  const columns = useMemo(
    () => [
      {
        header: "Employee",
        accessorFn: (row) =>
          `${row.first_name} ${row.middle_name ? row.middle_name + ". " : ""}${row.last_name}${
            row.extension_name ? ", " + row.extension_name : ""
          }`,
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
                {row.original.first_name?.[0]}
                {row.original.last_name?.[0]}
              </Text>
            </Box>
            <Box>
              <Text>
                {row.original.first_name}{" "}
                {row.original.middle_name ? row.original.middle_name + ". " : ""}
                {row.original.last_name} {row.original.extension_name ?? ""}
              </Text>
              <Text size="xs" c="dimmed">
                Role: {row.original.hr_role}
              </Text>
            </Box>
          </Flex>
        ),
      },
      {
        accessorKey: "employer_id",
        header: "Employee ID",
      },
      {
        accessorKey: "workstation_type",
        header: "Workstation Type",
      },
      {
        accessorFn: (row) => row.office_name || row.school_name,
        id: "workstation",
        header: "Workstation",
      },
      {
        accessorKey: "is_verified",
        header: "Verified",
        Cell: ({ cell }) => (
          <Text color={cell.getValue() ? "green" : "red"}>
            {cell.getValue() ? "Yes" : "No"}
          </Text>
        ),
      },
      // Action column
      {
        id: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Button
            size="xs"
            onClick={() => {
              setSelectedUser(row.original);
              setModalOpened(true);
            }}
          >
            Edit
          </Button>
        ),
      },
    ],
    []
  );

  // Table instance
  const table = useMantineReactTable({
    columns,
    data: users,
    enableRowSelection: true,
    enableGlobalFilter: true,
    manualPagination: true,
    manualGlobalFilter: true,
    rowCount: totalCount,
    state: { pagination, globalFilter },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    enableColumnActions: false,
    enableColumnOrdering: true,
    enableColumnFilters: true,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 }, showGlobalFilter: true },
    mantineTableContainerProps: {
      style: { maxHeight: "calc(100vh - 220px)", overflowY: "auto" },
    },
  defaultColumn: {
    minSize: 20,
    size: "auto",
    maxSize: Number.MAX_SAFE_INTEGER,
  },
    renderTopToolbar: ({ table }) => {
      const selected = table.getSelectedRowModel().flatRows;

      const bulkUpdate = async (is_verified) => {
        const payload = selected.map((row) => ({
          id: row.original.user_id,
          is_verified: is_verified,
        }));

        try {
          await API.post("/auth/user/bulk-update", payload);

          // Refresh table after update
          fetchUsers(globalFilter);

          // Clear selected rows
          table.resetRowSelection();
        } catch (err) {
          console.error("Bulk update error:", err);
        }
      };

      return (
        <Flex justify="space-between" p="md">
          {/* LEFT SIDE (Search) */}
          <Flex gap="xs" align="center">
            <TextInput
              placeholder="Search by employee id..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="sm"
              style={{ width: 250 }}
            />
            <Button
              onClick={() => {
                setGlobalFilter(searchValue);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
            >
              Search
            </Button>
            <MRT_ToggleFiltersButton table={table} />
          </Flex>

          {/* RIGHT SIDE (Activate / Deactivate) */}
          <Flex gap="xs">
            <Button
              color="red"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={() => bulkUpdate(false)}
            >
              Deactivate
            </Button>

            <Button
              color="green"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={() => bulkUpdate(true)}
            >
              Activate
            </Button>
          </Flex>
        </Flex>
      );
    },
  });

  return (
    <Box>
      <MantineReactTable table={table} />

      {/* Edit Modal */}
      {selectedUser && (
        <EditWorkstationModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          user={selectedUser}
          onUpdated={() => {
            fetchUsers(globalFilter); // refresh table after saving
            setModalOpened(false);
          }}
        />
      )}
    </Box>
  );
};

export default UserManagementTable;
