"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createTask,
  updateTask,
  getTaskById,
  TaskPayload,
} from "@/app/services/task/task.service";
import { getAllActiveUsers } from "@/app/services/user/user.service";
import { getAllActiveCompany } from "@/app/services/company/company.service";
import { getAllActiveContacts } from "@/app/services/contact/contact.service";
import { getAllActiveOpportunity } from "@/app/services/opportunity/opportunity.service";
import { getAllActiveQuotes } from "@/app/services/quote/quote.service";
import { getAllActiveTaskType } from "@/app/services/task-type/task-type.service";
import { getAllActiveTaskStatus } from "@/app/services/task-status/task-status.service";
import { getAllActivePriority } from "@/app/services/priority/priority.service";
import { OptionDropDownModel } from "@/app/models/dropDownOption.model";
import { useError } from "@/app/providers/ErrorProvider";
import InputField from "@/app/common/InputFeild";
import SelectDropdown from "@/app/common/dropdown";
import DateInput from "@/app/common/CommonDate";
import SlideOver from "@/app/common/slideOver";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

// SlideOver create forms
import CreateCompanyForm from "../../company/create/page";
import CreateContactForm from "../../contact/create/page";
import CreateOpportunity from "../../opportunity/create/page";
import CreateQuote from "../../sales/qoutes/Create/page";

// Dialog popup create forms
import CreateTaskTypeForm from "../../settings/task-setup/task-type/create/page";
import CreateTaskStatusForm from "../../settings/task-setup/task-status/create/page";
import CreatePriorityForm from "../../settings/priority/create/page";

interface CreateTaskProps {
  onClose: () => void;
  onSuccess?: () => void;
  taskId?: number | null;
  defaultContactId?: number;
  defaultCompanyId?: number;
  defaultOpportunityId?: number;
}

export default function CreateTask({
  onClose,
  onSuccess,
  taskId,
  defaultContactId,
  defaultCompanyId,
  defaultOpportunityId,
}: CreateTaskProps) {
  const { showSuccess, showError } = useError();
  const isEditMode = !!taskId;
  const [loading, setLoading] = useState(false);
  const [fetchingTask, setFetchingTask] = useState(false);
  const [formData, setFormData] = useState<TaskPayload>({
    name: "",
    assignee_id: 0,
    company_id: defaultCompanyId || 0,
    contact_id: defaultContactId || 0,
    opportunity_id: defaultOpportunityId || 0,
    Task_id: 0,
    task_type_id: 0,
    task_priority_id: 0,
    task_status_id: 0,
    due_date: new Date(),
    description: "",
  });

  // Dropdown options
  const [users, setUsers] = useState<OptionDropDownModel[]>([]);
  const [companies, setCompanies] = useState<OptionDropDownModel[]>([]);
  const [contacts, setContacts] = useState<OptionDropDownModel[]>([]);
  const [opportunities, setOpportunities] = useState<OptionDropDownModel[]>([]);
  const [quotes, setQuotes] = useState<OptionDropDownModel[]>([]);
  const [taskTypes, setTaskTypes] = useState<OptionDropDownModel[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<OptionDropDownModel[]>([]);
  const [priorities, setPriorities] = useState<OptionDropDownModel[]>([]);

  // SlideOver states
  const [openCompanySlider, setOpenCompanySlider] = useState(false);
  const [openContactSlider, setOpenContactSlider] = useState(false);
  const [openOpportunitySlider, setOpenOpportunitySlider] = useState(false);
  const [openQuoteSlider, setOpenQuoteSlider] = useState(false);

  // Dialog states
  const [openTaskTypeModal, setOpenTaskTypeModal] = useState(false);
  const [openTaskStatusModal, setOpenTaskStatusModal] = useState(false);
  const [openPriorityModal, setOpenPriorityModal] = useState(false);

  // Fetch all dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [
          usersRes,
          companiesRes,
          contactsRes,
          opportunitiesRes,
          quotesRes,
          taskTypesRes,
          taskStatusesRes,
          prioritiesRes,
        ] = await Promise.all([
          getAllActiveUsers(),
          getAllActiveCompany(),
          getAllActiveContacts(),
          getAllActiveOpportunity(),
          getAllActiveQuotes(),
          getAllActiveTaskType(),
          getAllActiveTaskStatus(),
          getAllActivePriority(),
        ]);

        setUsers(usersRes.data || []);
        setCompanies(companiesRes.data || []);
        setContacts(contactsRes.data || []);
        setOpportunities(opportunitiesRes.data || []);
        setQuotes(quotesRes.data || []);
        setTaskTypes(taskTypesRes.data || []);
        setTaskStatuses(taskStatusesRes.data || []);
        setPriorities(prioritiesRes.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch task data when editing
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!taskId) return;

      try {
        setFetchingTask(true);
        const response = await getTaskById(taskId);
        if (response.data) {
          const task = response.data;
          setFormData({
            name: task.name || "",
            assignee_id: task.assignee_id || 0,
            company_id: task.company_id || 0,
            contact_id: task.contact_id || 0,
            opportunity_id: task.opportunity_id || 0,
            Task_id: task.quote_id || 0,
            task_type_id: task.task_type_id || 0,
            task_priority_id: task.task_priority_id || 0,
            task_status_id: task.task_status_id || 0,
            due_date: task.due_date ? new Date(task.due_date) : new Date(),
            description: task.description || "",
          });
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setFetchingTask(false);
      }
    };

    fetchTaskData();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showError("Task name is required");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && taskId) {
        const response = await updateTask(taskId, formData);
        if (response.isSuccess) {
          showSuccess("Task updated successfully");
          onSuccess?.();
          onClose();
        } else {
          showError("Failed to update task");
        }
      } else {
        const response = await createTask(formData);
        if (response.isSuccess) {
          showSuccess("Task created successfully");
          onSuccess?.();
          onClose();
        } else {
          showError("Failed to create task");
        }
      }
    } catch (error) {
      showError(`Failed to ${isEditMode ? "update" : "create"} task`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTask) {
    return (
      <div className="h-full flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold">
          {isEditMode ? "Edit Task" : "Create Task"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-5">
          <div className="md:col-span-2">
            <InputField
              label="Task Name"
              required
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              noLeadingSpace
              placeholder="Enter task name"
            />
          </div>

          <SelectDropdown
            label="Assignee"
            value={formData.assignee_id}
            onChange={(v) =>
              setFormData({ ...formData, assignee_id: v ? Number(v) : 0 })
            }
            options={users.map((u) => ({ label: u.name, value: u.id }))}
            placeholder="Select Assignee"
          />
          <SelectDropdown
            label="Company"
            value={formData.company_id}
            onChange={(v) =>
              setFormData({ ...formData, company_id: v ? Number(v) : 0 })
            }
            options={companies.map((c) => ({ label: c.name, value: c.id }))}
            onAddClick={() => setOpenCompanySlider(true)}
            placeholder="Select Company"
          />
          <SelectDropdown
            label="Contact"
            value={formData.contact_id}
            onChange={(v) =>
              setFormData({ ...formData, contact_id: v ? Number(v) : 0 })
            }
            options={contacts.map((c) => ({ label: c.name, value: c.id }))}
            onAddClick={() => setOpenContactSlider(true)}
            placeholder="Select Contact"
          />
          <SelectDropdown
            label="Opportunity"
            value={formData.opportunity_id}
            onChange={(v) =>
              setFormData({ ...formData, opportunity_id: v ? Number(v) : 0 })
            }
            options={opportunities.map((o) => ({
              label: o.name,
              value: o.id,
            }))}
            onAddClick={() => setOpenOpportunitySlider(true)}
            placeholder="Select Opportunity"
          />
          <SelectDropdown
            label="Quote"
            value={formData.Task_id}
            onChange={(v) =>
              setFormData({ ...formData, Task_id: v ? Number(v) : 0 })
            }
            options={quotes.map((q) => ({ label: q.name, value: q.id }))}
            onAddClick={() => setOpenQuoteSlider(true)}
            placeholder="Select Quote"
          />
          <SelectDropdown
            label="Task Type"
            value={formData.task_type_id}
            onChange={(v) =>
              setFormData({ ...formData, task_type_id: v ? Number(v) : 0 })
            }
            options={taskTypes.map((t) => ({ label: t.name, value: t.id }))}
            onAddClick={() => setOpenTaskTypeModal(true)}
            placeholder="Select Task Type"
          />
          <SelectDropdown
            label="Task Priority"
            value={formData.task_priority_id}
            onChange={(v) =>
              setFormData({
                ...formData,
                task_priority_id: v ? Number(v) : 0,
              })
            }
            options={priorities.map((p) => ({ label: p.name, value: p.id }))}
            onAddClick={() => setOpenPriorityModal(true)}
            placeholder="Select Priority"
          />
          <SelectDropdown
            label="Task Status"
            value={formData.task_status_id}
            onChange={(v) =>
              setFormData({ ...formData, task_status_id: v ? Number(v) : 0 })
            }
            options={taskStatuses.map((s) => ({ label: s.name, value: s.id }))}
            onAddClick={() => setOpenTaskStatusModal(true)}
            placeholder="Select Status"
          />
          <DateInput
            label="Due Date"
            value={
              formData.due_date instanceof Date
                ? formData.due_date.toISOString().split("T")[0]
                : ""
            }
            onChange={(v) => setFormData({ ...formData, due_date: new Date(v) })}
          />
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Description"
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 border-gray-300"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t bg-white">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto sm:min-w-[120px]"
        >
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Task"
              : "Create Task"}
        </Button>
      </div>

      {/* Company SlideOver */}
      {openCompanySlider && (
        <SlideOver
          open={openCompanySlider}
          onClose={() => setOpenCompanySlider(false)}
          width="max-w-2xl"
        >
          <CreateCompanyForm
            mode="create"
            onClose={() => setOpenCompanySlider(false)}
            onSuccess={async () => {
              setOpenCompanySlider(false);
              const res = await getAllActiveCompany();
              setCompanies(res.data || []);
            }}
          />
        </SlideOver>
      )}

      {/* Contact SlideOver */}
      {openContactSlider && (
        <SlideOver
          open={openContactSlider}
          onClose={() => setOpenContactSlider(false)}
          width="max-w-2xl"
        >
          <CreateContactForm
            mode="create"
            onClose={() => setOpenContactSlider(false)}
            onSuccess={async () => {
              setOpenContactSlider(false);
              const res = await getAllActiveContacts();
              setContacts(res.data || []);
            }}
          />
        </SlideOver>
      )}

      {/* Opportunity SlideOver */}
      {openOpportunitySlider && (
        <SlideOver
          open={openOpportunitySlider}
          onClose={() => setOpenOpportunitySlider(false)}
          width="sm:w-[70vw] lg:w-[40vw]"
        >
          <CreateOpportunity
            mode="create"
            onClose={() => setOpenOpportunitySlider(false)}
            onSuccess={async () => {
              setOpenOpportunitySlider(false);
              const res = await getAllActiveOpportunity();
              setOpportunities(res.data || []);
            }}
          />
        </SlideOver>
      )}

      {/* Quote SlideOver */}
      {openQuoteSlider && (
        <SlideOver
          open={openQuoteSlider}
          onClose={() => setOpenQuoteSlider(false)}
          width="sm:w-[70vw] lg:w-[40vw]"
        >
          <CreateQuote
            onClose={() => setOpenQuoteSlider(false)}
            onSuccess={async () => {
              setOpenQuoteSlider(false);
              const res = await getAllActiveQuotes();
              setQuotes(res.data || []);
            }}
          />
        </SlideOver>
      )}

      {/* Task Type Dialog */}
      {openTaskTypeModal && (
        <Dialog open={openTaskTypeModal} onOpenChange={setOpenTaskTypeModal}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
            <CreateTaskTypeForm
              mode="create"
              onClose={() => setOpenTaskTypeModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenTaskTypeModal(false);
                const res = await getAllActiveTaskType();
                setTaskTypes(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Task Status Dialog */}
      {openTaskStatusModal && (
        <Dialog
          open={openTaskStatusModal}
          onOpenChange={setOpenTaskStatusModal}
        >
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
            <CreateTaskStatusForm
              mode="create"
              onClose={() => setOpenTaskStatusModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenTaskStatusModal(false);
                const res = await getAllActiveTaskStatus();
                setTaskStatuses(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Priority Dialog */}
      {openPriorityModal && (
        <Dialog open={openPriorityModal} onOpenChange={setOpenPriorityModal}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader />
            <CreatePriorityForm
              mode="create"
              onClose={() => setOpenPriorityModal(false)}
              popUp={true}
              onSuccess={async () => {
                setOpenPriorityModal(false);
                const res = await getAllActivePriority();
                setPriorities(res.data || []);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
