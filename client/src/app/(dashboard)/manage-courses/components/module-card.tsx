"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit2,
  GripVertical,
} from "lucide-react";
import EditModuleDialog from "./edit-module-dialog";
import LectureList from "./lecture-list";
import CreateLectureDialog from "../components/create-lecture-dialog";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import { Module } from "../types";
import { deleteModule } from "../action";

// dnd/kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateLectureDialogOpen, setIsCreateLectureDialogOpen] =
    useState(false);

  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: module.id,
  });

  const style = {
    transition: "transform 0.2s ease-in-out",
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className="overflow-hidden transition-all hover:shadow-md"
      >
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-border bg-card/50 p-4">
          <div className="flex flex-1 items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded p-1 hover:bg-muted"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{module.title}</h3>
              <p className="text-sm text-muted-foreground">
                {module.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {module.lectures.length} lectures
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="gap-1 bg-transparent"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="gap-1 bg-transparent text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none flex-shrink-0 ml-0.5"
              variant="ghost"
              size="icon"
              disabled={
                isExpanded ||
                isEditDialogOpen ||
                isDeleteDialogOpen ||
                isCreateLectureDialogOpen
              }
            >
              <GripVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Lectures Section */}
        {isExpanded && (
          <div className="border-t border-border bg-background/50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium text-foreground">Lectures</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCreateLectureDialogOpen(true)}
                className="gap-1 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Lecture
              </Button>
            </div>

            {module.lectures.length === 0 ? (
              <div className="rounded bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">No lectures yet</p>
              </div>
            ) : (
              <LectureList lectures={module.lectures} moduleId={module.id} />
            )}
          </div>
        )}
      </Card>

      {/* Edit Module Dialog */}
      <EditModuleDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        module={module}
      />

      {/* Delete Module Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Module?"
        description={
          <span>
            Are you sure you want to delete the module &quot;
            <strong>{module.title}</strong>&quot;? This action cannot be undone
            and will delete all lectures within this module.
          </span>
        }
        action={deleteModule}
        targetId={module.id}
        inputIdName="moduleId"
      />

      <CreateLectureDialog
        isOpen={isCreateLectureDialogOpen}
        onOpenChange={setIsCreateLectureDialogOpen}
        moduleId={module.id}
      />
    </>
  );
}
