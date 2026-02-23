import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { updateProduct, deleteProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import type { Product, Category } from "@/models";

interface EditProductDialogProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function EditProductDialog({ product, open, onOpenChange, onSuccess }: EditProductDialogProps) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [categoryId, setCategoryId] = useState(product.categoryId);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(product.image);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Reset form when product changes or dialog opens
    useEffect(() => {
        if (open) {
            setName(product.name);
            setDescription(product.description);
            setCategoryId(product.categoryId);
            setSelectedImage(null);
            setImagePreview(product.image);
            // Load categories for the dropdown
            getCategories().then(setCategories).catch(console.error);
        }
    }, [open, product]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Product name is required");
            return;
        }

        setIsSaving(true);
        try {
            let imageUrl = product.image;

            // Upload new image if selected
            if (selectedImage) {
                const category = categories.find(c => c.id === categoryId);
                const categorySlug = category?.slug || product.categorySlug;
                const normalizedName = name.toLowerCase().trim();
                const storagePath = `products/${categorySlug}/${normalizedName}.png`;
                const storageRef = ref(storage, storagePath);
                await uploadBytes(storageRef, selectedImage);
                imageUrl = await getDownloadURL(storageRef);
            }

            await updateProduct(product.id, {
                name: name.trim(),
                description: description.trim(),
                categoryId,
                image: imageUrl,
            });

            toast.success("Product updated successfully!");
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteProduct(product.id);
            toast.success("Product deleted successfully!");
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Image Preview */}
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="w-full h-40 rounded-lg overflow-hidden bg-muted border">
                            <img src={imagePreview} alt={name} className="w-full h-full object-cover" />
                        </div>
                        <Input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleImageChange}
                        />
                        <p className="text-xs text-muted-foreground">Leave empty to keep current image</p>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-prod-name">Name</Label>
                        <Input
                            id="edit-prod-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Product name"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={categoryId} onValueChange={setCategoryId}>
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
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-prod-desc">Description</Label>
                        <Textarea
                            id="edit-prod-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Product description..."
                            className="min-h-[80px]"
                        />
                    </div>
                </div>

                <DialogFooter className="flex !justify-between items-center gap-2 sm:gap-0">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isSaving || isDeleting} className="gap-1.5">
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete <strong>{product.name}</strong>. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Yes, Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving || isDeleting}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving || isDeleting}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
