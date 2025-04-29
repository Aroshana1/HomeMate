import React, { useState } from "react";
import { z } from "zod";
import { format, parseISO, isAfter } from "date-fns";

const taskSchema = z.object({
  taskName: z
    .string()
    .min(3, "Task name must be at least 3 characters")
    .regex(/^[A-Za-z\s]+$/, "Task name can only contain letters and spaces"),
  taskType: z.string().nonempty("Please select a task type"),
  taskDate: z.string().refine((val) => {
    const date = parseISO(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    return !isNaN(date.getTime()) && isAfter(date, today);
  }, "Due date must be in the future"),
});

const TaskForm = ({ task, onSave, onClose }) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [formData, setFormData] = useState({
    taskName: task?.taskName || "",
    taskType: task?.taskType || "cleaning",
    taskDate: task?.taskDate || today,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      taskSchema.parse(formData);
      onSave({
        ...task,
        ...formData,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {};
        err.errors.forEach((error) => {
          newErrors[error.path[0]] = error.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const taskTypes = [
    "cleaning",
    "shopping",
    "laundry",
    "maintenance",
    "organization",
    "outdoor",
    "cooking",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {task ? "Edit Task" : "Add New Task"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="taskName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Task Name
              </label>
              <input
                type="text"
                id="taskName"
                name="taskName"
                className={`w-full p-2 border rounded-md ${
                  errors.taskName ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.taskName}
                onChange={handleChange}
              />
              {errors.taskName && (
                <p className="mt-1 text-sm text-red-600">{errors.taskName}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="taskType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Task Type
              </label>
              <select
                id="taskType"
                name="taskType"
                className={`w-full p-2 border rounded-md ${
                  errors.taskType ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.taskType}
                onChange={handleChange}
              >
                {taskTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.taskType && (
                <p className="mt-1 text-sm text-red-600">{errors.taskType}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="taskDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date
              </label>
              <input
                type="date"
                id="taskDate"
                name="taskDate"
                min={today}
                className={`w-full p-2 border rounded-md ${
                  errors.taskDate ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.taskDate}
                onChange={handleChange}
              />
              {errors.taskDate && (
                <p className="mt-1 text-sm text-red-600">{errors.taskDate}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
