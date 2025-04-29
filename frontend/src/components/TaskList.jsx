import React, { useState, useEffect, useMemo } from "react";
import TaskFilters from "./TaskFilters";
import Pagination from "./Pagination";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  differenceInDays,
} from "date-fns";

const TaskList = ({ tasks, onEdit, onDelete, onComplete }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 8;

  // Update filteredTasks when tasks prop changes
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleFilterChange = (filteredData) => {
    setFilteredTasks(filteredData);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Memoize pagination calculations
  const { currentTasks, totalPages } = useMemo(() => {
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.max(
      1,
      Math.ceil(filteredTasks.length / tasksPerPage)
    );

    return { currentTasks, totalPages };
  }, [currentPage, filteredTasks, tasksPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getTaskPriority = (taskDate) => {
    const date = parseISO(taskDate);
    const daysUntilDue = differenceInDays(date, new Date());

    if (daysUntilDue < 0) return "overdue";
    if (daysUntilDue === 0) return "due-today";
    if (daysUntilDue === 1) return "due-tomorrow";
    if (daysUntilDue <= 3) return "due-soon";
    return "due-later";
  };

  return (
    <div>
      <TaskFilters tasks={tasks} onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => {
                  const priorityClass = getTaskPriority(task.taskDate);
                  const isDueSoon =
                    priorityClass === "due-today" ||
                    priorityClass === "due-tomorrow" ||
                    priorityClass === "overdue";

                  return (
                    <tr
                      key={task.taskId}
                      className={`${
                        isDueSoon ? "bg-red-50" : ""
                      } hover:bg-gray-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {task.taskName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            task.taskType === "cleaning"
                              ? "bg-blue-100 text-blue-800"
                              : task.taskType === "shopping"
                              ? "bg-green-100 text-green-800"
                              : task.taskType === "laundry"
                              ? "bg-purple-100 text-purple-800"
                              : task.taskType === "outdoor"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.taskType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(parseISO(task.taskDate), "MMM dd, yyyy")}
                          {isToday(parseISO(task.taskDate)) && (
                            <span className="ml-2 text-xs text-red-600">
                              Today!
                            </span>
                          )}
                          {isTomorrow(parseISO(task.taskDate)) && (
                            <span className="ml-2 text-xs text-orange-600">
                              Tomorrow
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            task.taskStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {task.taskStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEdit(task)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(task.taskId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                          {task.taskStatus !== "completed" && (
                            <button
                              onClick={() => onComplete(task.taskId)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No tasks found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTasks.length > tasksPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TaskList;
