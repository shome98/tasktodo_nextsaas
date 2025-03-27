"use client"
import React from 'react'
import { CategoryModalForm } from '../category/CategoryModalForm'
import { CategoryTable } from '../category/CategoryTable'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/requiredtypes';
import { toast } from 'sonner';
import Loading from '../Loading';

const CategoryViewv1 = () => {
    const { status, data: session } = useSession();
    const router = useRouter();

    const [categories, setCategories] = React.useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);

    React.useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status === "authenticated" && session?.user?.id) {
            fetchCategories();
        }
    }, [status, session, router]);

    const fetchCategories = async () => {
        const res = await fetch(`/api/expenses/category?userId=${session?.user?.id}`);
        const data = await res.json();
        if (data.categories) setCategories(data.categories);
    };
    const handleCreateOrUpdateCategory = async (data: { name: string }) => {
        const method = editingCategory ? "PUT" : "POST";
        const url = editingCategory ? `/api/expenses/category/${editingCategory._id}` : "/api/expenses/category";
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, userId: session?.user?.id, _id: editingCategory?._id }),
        });
        if (response.ok) {
            await fetchCategories();
            setEditingCategory(null);
            toast.success(editingCategory ? "😊 Category Updated" : "😊 Category Created", {
                description: `The category has been ${editingCategory ? "updated" : "created"} successfully.`,
            });
        } else {
            const errorData = await response.json();
            toast.error("Error", { description:` 😵 ${errorData.error} `});
        }
    };

    const handleDeleteCategory = async (id: string) => {
        const response = await fetch(`/api/expenses/category?_id=${id}&userId=${session?.user?.id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            fetchCategories();
            toast.success("Category Deleted", { description: "The category has been successfully removed." });
        } else {
            const errorData = await response.json();
            toast.error("Error", { description:` 😵 ${errorData.error} `});
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

    if (status === "loading") {
        return <Loading name={"Categories"}/>
    }
    
    return (
        <div className="w-full max-w-6xl mx-auto py-6 px-4 md:py-8 pt-24">
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
                <CategoryTable
                    categories={categories}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                />
            </section>
        </div>
    );
}

export default CategoryViewv1