import { useEffect, useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";

import { Button, Flex,Box,Text } from "@mantine/core";

import API from "@/api/axios";
import { showSuccess, showError, showConfirm } from "@/utils/alerts";
import AddEmployee from "../components/AddEmployee";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  /** Fetch Employees */

const fetchEmployees = async () => {
  try {
    const workstation_hold = localStorage.getItem("workstation_hold");
    const page = pagination.pageIndex + 1;
    const limit = pagination.pageSize;

    let res;

       if (workstation_hold && workstation_hold.toLowerCase() !== "none") {
      
      res = await API.get(
        `/employee/employees-with-workstation?page=${page}&limit=${limit}&workstation_id=${workstation_hold}`
      );
    } else {
      res = await API.get(
        `/employee/employees-with-workstation?page=${page}&limit=${limit}`
      );
    }

    setEmployees(res.data.results || []);
    setTotalCount(res.data.total_count || 0);

  } catch (error) {
    console.error("❌ Error fetching employees:", error);
  }
};


  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [pagination.pageIndex, pagination.pageSize]);

  /** Table Columns */
  const columns = useMemo(
    () => [
        {
             header: "Employee",
             accessorFn: (row) =>
               `${row.f_name} ${row.l_name}`,
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
                     {row.original.l_name}
                   </Text>
                   <Text size="xs" c="dimmed">
                     {row.original.email_address}
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
        accessorKey: "position_name",
        header: "Position",
      },
      {
        accessorKey: "workstation_name",
        header: "Workstation",
      },
      {
        accessorKey: "workstation_type",
        header: "Type",
      },
     {
  id: "actions",
  header: "Actions",
  Cell: ({ row }) => (
    <Button
      onClick={() => navigate(`/employees/${row.original.employee_id}`)}
      size="xs"
      variant="light"
      color="blue"
    >
      View
    </Button>
  ),
},

    ],
    []
  );

  /** Mantine Table Config */
  const table = useMantineReactTable({
    columns,
    data: employees,

    manualPagination: true,
    rowCount: totalCount,

    state: { pagination },
    onPaginationChange: setPagination,

    initialState: {
      showGlobalFilter: true,
    },

    renderTopToolbar: ({ table }) => (
      <Flex p="md" justify="space-between">
        <Flex gap="xs">
          <MRT_GlobalFilterTextInput table={table} />
          <MRT_ToggleFiltersButton table={table} />
        </Flex>

        {/* Restore YOUR ORIGINAL SHADCN DIALOG */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
            color="green">Add Employee
            
                      

            </Button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <AddEmployee onSuccess={fetchEmployees} />
          </DialogContent>
        </Dialog>
      </Flex>
    ),
  });

  return (
    <div className="space-y-4 bg-[#F7F9F7] px-5 py-2">
      <div>
        <h1 className="md:text-2xl text-xl font-semibold text-[#1A3A1A]">
          Employee Management
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Manage and Review Employees
        </p>
      </div>

      <MantineReactTable table={table} />
    </div>
  );
};

export default Employees;
