import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Edit2, 
  Trash2,
  Plus,
  Umbrella,
  HeartPulse,
  TrendingUp,
  ArrowLeft,
  FileText
} from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function LeaveCredits() {
  const { employee_id } = useParams();
  const navigate = useNavigate();
  
  const API_URL = import.meta.env.VITE_API_URL;
  const [leaveData, setLeaveData] = useState([]);
  const [totalLeave, setTotalLeave] = useState({ sick_leave: 0, vacation_leave: 0 });
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({ points: "", types: "sick", status: "pending" });

  const [openEdit, setOpenEdit] = useState(false);
  const [editForm, setEditForm] = useState({ points: "", types: "sick", status: "pending" });
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Fetch all leave points for the employee
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch leave points
      const leaveRes = await axios.get(`${API_URL}/leave_points/${employee_id}`);
      setLeaveData(leaveRes.data);
      
      // Fetch total leave
      const totalRes = await axios.get(`${API_URL}/leave_points/total/${employee_id}`);
      setTotalLeave(totalRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employee_id]);

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/leave_points/add/`, {
        employee_id: employee_id,
        ...form
      });
      
      setForm({ points: "", types: "sick", status: "pending" });
      setOpenCreate(false);
      fetchData();
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create leave. Please try again.");
    }
  };

  const openEditDialog = (item) => {
    setSelectedLeave(item);
    setEditForm({
      points: item.points.toString(),
      types: item.types.toLowerCase(),
      status: item.status.toLowerCase(),
    });
    setOpenEdit(true);
  };

  const handleEdit = async () => {
    if (!selectedLeave) return;
    try {
      await axios.post(`${API_URL}/leave_points/add/`, {
        employee_id: selectedLeave.employee_id,
        points: editForm.points,
        types: editForm.types,
        status: editForm.status,
      });
      
      setEditForm({ points: "", types: "sick", status: "pending" });
      setSelectedLeave(null);
      setOpenEdit(false);
      fetchData();
    } catch (error) {
      console.error("Edit error:", error);
      alert("Failed to update leave. Please try again.");
    }
  };

  const handleDelete = async (leaveId) => {
    if (!confirm("Are you sure you want to delete this leave?")) return;
    try {
      await axios.delete(`${API_URL}/leave_points/delete/${leaveId}`);
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete leave. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
      case "approve":
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "cancel":
      case "cancelled":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border border-amber-200 font-medium">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getTypeIcon = (type) => {
    const normalizedType = type?.toLowerCase();
    return normalizedType === "sick" ? (
      <HeartPulse className="w-4 h-4 text-blue-600" />
    ) : (
      <Umbrella className="w-4 h-4 text-purple-600" />
    );
  };

  const handleBack = () => {
    navigate(`/employees/${employee_id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="hover:bg-white"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leave Credits</h1>
              <p className="text-gray-500 text-sm mt-1">Manage employee leave applications</p>
            </div>
          </div>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Leave
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Leave</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="Enter points"
                    value={form.points}
                    onChange={(e) => setForm({ ...form, points: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={form.types}
                    onValueChange={(value) => setForm({ ...form, types: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="vacation">Vacation Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => setForm({ ...form, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approve">Approved</SelectItem>
                      <SelectItem value="cancel">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 mt-2">
                  Create Leave
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Sick Leave</p>
                  <p className="text-3xl font-bold text-gray-900">{totalLeave.sick_leave}</p>
                  <p className="text-xs text-gray-500">Available days</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <HeartPulse className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Vacation Leave</p>
                  <p className="text-3xl font-bold text-gray-900">{totalLeave.vacation_leave}</p>
                  <p className="text-xs text-gray-500">Available days</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Umbrella className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalLeave.sick_leave + totalLeave.vacation_leave}
                  </p>
                  <p className="text-xs text-gray-500">Combined total</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Leave History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : leaveData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <FileText className="w-12 h-12 mb-3 text-gray-300" />
                <p className="font-medium">No leave records found</p>
                <p className="text-sm">Add a new leave to get started</p>
              </div>
            ) : (
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50 z-10 border-b">
                    <tr>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Type</th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700 text-sm">Points</th>
                      <th className="text-right py-3 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveData.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.types)}
                            <span className="font-medium text-gray-700 capitalize">
                              {item.types}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">{item.points}</span>
                            <span className="text-sm text-gray-500">days</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(item)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 p-0 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Leave</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-points">Points</Label>
              <Input
                id="edit-points"
                type="number"
                value={editForm.points}
                onChange={(e) => setEditForm({ ...editForm, points: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={editForm.types}
                onValueChange={(value) => setEditForm({ ...editForm, types: value })}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="vacation">Vacation Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approve">Approved</SelectItem>
                  <SelectItem value="cancel">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 mt-2">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}