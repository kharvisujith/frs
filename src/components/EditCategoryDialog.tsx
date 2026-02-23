import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { updateCategory, deleteCategory } from "@/services/categoryService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import type { Category } from "@/models";

interface EditCategoryDialogProps {
    category: Category;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function EditCategoryDialog({ category, open, onOpenChange, onSuccess }: EditCategoryDialogProps) {
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    const [slug, setSlug] = useState(category.slug);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(category.image);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Reset form when category changes or dialog opens
    useEffect(() => {
        if (open) {
            setName(category.name);
            setDescription(category.description);
            setSlug(category.slug);
            setSelectedImage(null);
            setImagePreview(category.image);
        }
    }, [open, category]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        setIsSaving(true);
        try {
            let imageUrl = category.image;

            // Upload new image if selected
            if (selectedImage) {
                const storagePath = `category/${slug}.png`;
                const storageRef = ref(storage, storagePath);
                await uploadBytes(storageRef, selectedImage);
                imageUrl = await getDownloadURL(storageRef);
            }

            await updateCategory(category.id, {
                name: name.trim(),
                description: description.trim(),
                slug: slug.trim(),
                image: imageUrl,
            });

            toast.success("Category updated successfully!");
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCategory(category.id);
            toast.success("Category deleted successfully!");
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
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
                        <Label htmlFor="edit-cat-name">Name</Label>
                        <Input
                            id="edit-cat-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category name"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-cat-slug">Slug</Label>
                        <Input
                            id="edit-cat-slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="category-slug"
                        />
                        <p className="text-xs text-muted-foreground">URL-friendly identifier (e.g. "medical-supplies")</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-cat-desc">Description</Label>
                        <Textarea
                            id="edit-cat-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Category description..."
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
                                <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete <strong>{category.name}</strong>. Products in this category will NOT be deleted but will become orphaned. This action cannot be undone.
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
