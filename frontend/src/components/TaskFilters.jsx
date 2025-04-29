import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

const TaskFilters = ({ tasks, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskType.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = typeFilter === "all" || task.taskType === typeFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "all" || task.taskStatus === statusFilter;

      // Date filter
      let matchesDate = true;
      const today = new Date();
      const taskDate = parseISO(task.taskDate);

      if (dateFilter === "today") {
        matchesDate =
          format(taskDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
      } else if (dateFilter === "upcoming") {
        matchesDate = taskDate > today;
      } else if (dateFilter === "overdue") {
        matchesDate = taskDate < today && task.taskStatus !== "completed";
      }

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });

    onFilterChange(filtered);
  }, [searchTerm, typeFilter, statusFilter, dateFilter, tasks, onFilterChange]);

  const taskTypes = [...new Set(tasks.map((task) => task.taskType))];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search tasks..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task Type
          </label>
          <select
            id="type"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {taskTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date Filter
          </label>
          <select
            id="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
