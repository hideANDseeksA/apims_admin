import { useMemo, useEffect, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import {
  Box,
  Button,
  Flex,
  Menu,
  Text,
  TextInput,
} from "@mantine/core";
import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";

const RetirementTable = () => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // 🔍 Search (server-side only)
  const [searchValue, setSearchValue] = useState("");
  const [serverSearch, setServerSearch] = useState(null);

  /* ---------------- API ---------------- */

  const fetchRetirements = async () => {
    try {
      const res = await API.get("/retirement/", {
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: serverSearch,
        },
      });

      setData(res.data.data || []);
      setTotalRecords(res.data.total_count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRetirements();
  }, [pagination.pageIndex, pagination.pageSize, serverSearch]);

  /* ---------------- ACTIONS ---------------- */

  const updateRemarks = (employeeId, remarks) =>
    API.put(`/retirement/remarks/${employeeId}`, { remarks });

  const handleAction = async (type) => {
    const confirm = await showConfirm(
      `Are you sure you want to mark this as ${type}?`
    );
    if (!confirm.isConfirmed) return;

    const selectedRows = table.getSelectedRowModel().flatRows;

    const remarksValue =
      type === "Retired"
        ? "Retired"
        : type === "Resigned"
        ? "Resigned"
        : null;

    try {
      await Promise.all(
        selectedRows.map((row) =>
          updateRemarks(row.original.employee_id, remarksValue)
        )
      );

      await showSuccess(`${type} successfully updated`);
      table.resetRowSelection();
      fetchRetirements();
    } catch (err) {
      console.error(err);
      showError("Failed to update remarks");
    }
  };

  /* ---------------- COLUMNS ---------------- */

  const columns = useMemo(
    () => [
      {
        header: "Employee",
        accessorFn: (row) =>
          `${row.f_name} ${row.m_name ? row.m_name + "." : ""} ${row.l_name}`,
        id: "employee",
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
              <Text fw={600}>
                {row.original.f_name?.[0]}
                {row.original.l_name?.[0]}
              </Text>
            </Box>
            <Box>
              <Text>
                {row.original.f_name}{" "}
                {row.original.m_name ? row.original.m_name + ". " : ""}
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
      {
        accessorKey: "notifier",
        header: "Notified",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <Text c="green" fw={600}>Notified</Text>
          ) : (
            <Text c="red" fw={600}>Not Yet</Text>
          ),
      },
    ],
    []
  );

  /* ---------------- TABLE ---------------- */

  const table = useMantineReactTable({
    columns,
    data,

    // Server-side pagination only
    manualPagination: true,
    rowCount: totalRecords,
    onPaginationChange: setPagination,
    state: { pagination },

    // ❌ Disable MRT global filter
    enableGlobalFilter: false,

    // ✅ Local-only column filters
    enableColumnFilters: true,
    enableColumnFilterModes: true,

    enableRowSelection: true,
    enableColumnOrdering: true,
    enablePagination: true,
    enableColumnActions: false,

    mantineTableContainerProps: {
      style: {
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
      },
    },

    renderTopToolbar: () => (
      <Flex justify="space-between" p="md">
        <Flex gap="xs" align="center">
          <TextInput
            placeholder="Search by employer ID or remarks..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="sm"
            w={260}
          />
          <Button
            onClick={() => {
              setServerSearch(searchValue || null);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          >
            Search
          </Button>
          <MRT_ToggleFiltersButton table={table} />
        </Flex>

        <Flex gap="xs">
          <Button
            color="gray"
            disabled={!table.getIsSomeRowsSelected()}
            onClick={() => handleAction("Reemployed")}
          >
            Reemployed
          </Button>
          <Button
            color="red"
            disabled={!table.getIsSomeRowsSelected()}
            onClick={() => handleAction("Resigned")}
          >
            Resigned
          </Button>
          <Button
            color="blue"
            disabled={!table.getIsSomeRowsSelected()}
            onClick={() => handleAction("Retired")}
          >
            Retired
          </Button>
        </Flex>
      </Flex>
    ),
  });

  return (
    <Box>
      <MantineReactTable table={table} />
    </Box>
  );
};

export default RetirementTable;
