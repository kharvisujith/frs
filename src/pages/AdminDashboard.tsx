
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCategories, createCategory } from "@/services/categoryService";
import { createProduct } from "@/services/productService";
import { Category } from "@/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, PlusCircle, FolderPlus, PackagePlus } from "lucide-react";
import { storage } from "@/lib/firebase"; // Ensure this internal import works
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = sessionStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/login");
            return;
        }
        loadCategories();
    }, [navigate]);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            toast.error("Failed to load categories");
        }
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            sessionStorage.removeItem("isAdmin");
            toast.success("Logged out successfully");
            window.location.href = "/login"; // Redirect to login
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 md:px-0">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-display text-primary">Admin Dashboard</h1>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                    Log out
                </Button>
            </div>

            <Tabs defaultValue="product" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="product" className="flex items-center gap-2">
                        <PackagePlus className="h-4 w-4" />
                        Add Product
                    </TabsTrigger>
                    <TabsTrigger value="category" className="flex items-center gap-2">
                        <FolderPlus className="h-4 w-4" />
                        Add Category
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="product">
                    <AddProductForm categories={categories} />
                </TabsContent>

                <TabsContent value="category">
                    <AddCategoryForm onSuccess={loadCategories} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

// ==========================================
// ADD PRODUCT FORM
// ==========================================

const AddProductForm = ({ categories }: { categories: Category[] }) => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const selectedCategoryId = watch("categoryId");
    const selectedCategory = categories.find(c => c.id === selectedCategoryId);

    const onSubmit = async (data: any) => {
        if (!selectedImage) {
            toast.error("Please upload a product image");
            return;
        }
        if (!selectedCategory) {
            toast.error("Please select a category");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Prepare Paths
            const normalizedName = data.name.toLowerCase().trim();
            const storagePath = `products/${selectedCategory.slug}/${normalizedName}.png`; // Force PNG extension as per convention

            // 2. Upload Image
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, selectedImage);
            const downloadURL = await getDownloadURL(storageRef);

            // 3. Create Product in Firestore
            await createProduct({
                name: data.name,
                description: data.description,
                categoryId: data.categoryId,
                image: downloadURL,
            });

            toast.success("Product added successfully!");
            reset();
            setSelectedImage(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add product. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>
                    Create a new product item. The image will be saved to <code>products/&lt;category&gt;/&lt;name&gt;.png</code>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(val) => setValue("categoryId", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && <span className="text-red-500 text-sm">Category is required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="e.g. Cement Bag" />
                        {errors.name && <span className="text-red-500 text-sm">Product name is required</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description", { required: true })}
                            placeholder="Enter product details..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Product Image</Label>
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) setSelectedImage(e.target.files[0]);
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Supports PNG/JPG. Will be renamed and saved as PNG.
                        </p>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                        Add Product
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

// ==========================================
// ADD CATEGORY FORM
// ==========================================

const AddCategoryForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const { register, handleSubmit, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const onSubmit = async (data: any) => {
        if (!selectedImage) {
            toast.error("Please upload a category image");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Prepare Slug & Path
            const slug = data.name.toLowerCase().trim().replace(/\s+/g, '-');
            const storagePath = `category/${slug}.png`;

            // 2. Upload Image
            const storageRef = ref(storage, storagePath);
            await uploadBytes(storageRef, selectedImage);
            const downloadURL = await getDownloadURL(storageRef);

            // 3. Create Category in Firestore
            await createCategory({
                name: data.name,
                slug: slug,
                description: data.description,
                image: downloadURL
            });

            toast.success("Category created successfully!");
            reset();
            setSelectedImage(null);
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create category. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>
                    Create a new product category. Image will be saved to <code>category/&lt;slug&gt;.png</code>.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="cat-name">Category Name</Label>
                        <Input id="cat-name" {...register("name", { required: true })} placeholder="e.g. Medical Supplies" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cat-desc">Description</Label>
                        <Textarea
                            id="cat-desc"
                            {...register("description", { required: true })}
                            placeholder="Category description..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Category Image</Label>
                        <Input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={(e) => {
                                if (e.target.files?.[0]) setSelectedImage(e.target.files[0]);
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            Supports PNG/JPG. Will be renamed and saved as PNG.
                        </p>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderPlus className="mr-2 h-4 w-4" />}
                        Create Category
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AdminDashboard;
