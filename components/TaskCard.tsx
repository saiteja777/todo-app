"use client";

import { TaskProps } from "@/lib/constants";
import { showErrorMessage } from "@/lib/utils";
import { updateTask } from "@/services/taskServices";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import Link from "next/link";

const TaskCard = ({
  task,
  setRefreshTasks,
}: {
  task: TaskProps;
  setRefreshTasks: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseColor = task.color || "#333333";
  const hoverOpacity = "70";

  const backgroundColor = isHovered
    ? `${baseColor}${hoverOpacity}`
    : `${baseColor}50`;

  const toggleCompletion = async () => {
    const taskId = task.id;

    try {
      const updatedTask = await updateTask(taskId!, {
        completed: !task.completed,
      });

      if (!updatedTask) {
        throw new Error("Failed to update task");
      }

      toast.success(
        `Task "${
          updatedTask.title.length > 10
            ? updatedTask.title.slice(0, 10) + "..."
            : updatedTask.title
        }" marked as ${!task.completed ? "completed" : "incomplete"}`
      );

      setRefreshTasks((prev) => prev + 1);
    } catch (error) {
      showErrorMessage(error as Error);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ backgroundColor }}
      className={`transition-colors duration-200 rounded-lg flex items-center justify-between gap-4 px-4`}
    >
      <div className="flex items-center gap-3">
        <div>
          {task.completed ? (
            <div
              onClick={toggleCompletion}
              className="w-[25px] h-[25px] cursor-pointer bg-purple rounded-full flex items-center justify-center"
            >
              <FaCheck className="text-white" />
            </div>
          ) : (
            <div
              onClick={toggleCompletion}
              className="w-[25px] h-[25px] cursor-pointer border-2 border-secondary rounded-full flex items-center justify-center"
            ></div>
          )}
        </div>
      </div>
      <Link
        href={`/edit-task/${task.id}`}
        className={`flex flex-1 text-wrap py-4 ${
          task.completed ? "line-through opacity-50" : ""
        }`}
      >
        {task.title}
      </Link>
      <ConfirmationModal taskId={task.id!} setRefreshTasks={setRefreshTasks} />
    </div>
  );
};

export default TaskCard;
