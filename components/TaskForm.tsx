"use client";

import Link from "next/link";
import React, { useState } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import InputField from "./InputField";
import ColorSection from "./ColorSection";
import CustomButton from "./CustomButton";
import { IoAddCircleOutline } from "react-icons/io5";
import { TaskProps } from "@/lib/constants";
import { createTask, updateTask } from "@/services/taskServices";
import { showErrorMessage } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";

const TaskForm = ({
  type,
  initialData,
}: {
  type: "create" | "edit";
  initialData?: TaskProps;
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [selectedColor, setSelectedColor] = useState(initialData?.color || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      toast.error("Title is required");
      return;
    }

    if (title.length > 100) {
      toast.error("Title cannot exceed 100 characters");
      return;
    }

    if (type === "create") {
      try {
        const newTask = await createTask({ title, color: selectedColor });

        if (newTask) {
          toast.success("Task created successfully!");
          router.replace("/");
          setTitle("");
          setSelectedColor("");
        }
      } catch (error) {
        showErrorMessage(error as Error);
      }
    } else if (type === "edit" && initialData) {
      try {
        const updatedTask = await updateTask(initialData.id as string, {
          title,
          color: selectedColor,
        });

        if (updatedTask) {
          router.replace("/");
          setTitle("");
          setSelectedColor("");
        }

        toast.success("Task updated successfully!");
      } catch (error) {
        showErrorMessage(error as Error);
      }
    }
  };

  return (
    <div className="w-[min(90%,736px)] mx-auto flex flex-col gap-5 -mt-7 md:mt-0">
      <Link href={"/"} className="w-fit cursor-pointer group mb-7">
        <RiArrowLeftLine className="text-2xl group-hover:text-secondary transition-colors duration-200" />
      </Link>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <InputField
              title="Title"
              placeholder="Ex. Brush your teeth"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p
              className={`text-sm mt-1 w-fit ml-auto transition-all duration-300 ${
                title.length > 100
                  ? "text-red-500 font-semibold"
                  : "text-secondary"
              }`}
            >
              {title.length}/100
            </p>
          </div>
          <ColorSection
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />

          <div className="mt-7">
            <CustomButton
              label={type === "create" ? "Create Task" : "Save"}
              Icon={type === "create" ? IoAddCircleOutline : FaCheck}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
