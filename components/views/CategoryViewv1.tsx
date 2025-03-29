// components/views/CategoryViewv1.tsx
"use client";
import React from "react";
import { CategoryModalForm } from "../category/CategoryModalForm";
import { CategoryTable } from "../category/CategoryTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/requiredtypes";
import { toast } from "sonner";
import Loading from "../Loading";
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { fetchCategoriesThunk, createOrUpdateCategoryThunk, deleteCategoryThunk } from '@/lib/redux/slices/categorySlice';

const CategoryViewv1 = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((state) => state.categories);

  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated" && session?.user?.id) {
      dispatch(fetchCategoriesThunk()).catch((error) => {
        toast.error("Error", { description: `😵 ${error.message}` });
      });
    }
  }, [status, session, router, dispatch]);

  const handleCreateOrUpdateCategory = async (data: { name: string }) => {
    try {
      await dispatch(createOrUpdateCategoryThunk({ ...data, _id: editingCategory?._id })).unwrap();
      setEditingCategory(null);
      setIsCategoryModalOpen(false);
      toast.success(editingCategory ? "😊 Category Updated" : "😊 Category Created", {
        description: `The category has been ${editingCategory ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await dispatch(deleteCategoryThunk(id)).unwrap();
      toast.success("Category Deleted", { description: "The category has been successfully removed." });
    } catch (error) {
      toast.error("Error", { description: `😵 ${(error as Error).message || "Unknown error"}` });
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
  };

  if (status === "loading" || loading) {
    return <Loading name={"Categories"} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8">
      <section className="mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Categories</h2>
        <div className="mb-8 flex justify-end">
          <CategoryModalForm
            onSubmit={handleCreateOrUpdateCategory}
            initialData={editingCategory || undefined}
            onCancel={handleCancelEditCategory}
            isOpen={isCategoryModalOpen}
            setIsOpen={setIsCategoryModalOpen}
          />
        </div>
        <CategoryTable categories={categories} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
      </section>
    </div>
  );
};

export default CategoryViewv1;