import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CategorySelectBreadcrumb } from './category-select-breadcrumb';

const CategorySelect = ({ finalSelect, setFinalSelect }) => {
    const { itemCategories } = usePage().props;
    const { currentLocale } = useTranslation(); // Replace with actual i18n logic

    const [openDialog, setOpenDialog] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const getCategoriesToRender = () => {
        if (selectedSubCategory?.children?.length) return selectedSubCategory.children;
        if (selectedCategory?.children?.length) return selectedCategory.children;
        return itemCategories;
    };

    const handleCategoryClick = (category) => {
        setFinalSelect(category);
        if (!selectedCategory) {
            setSelectedCategory(category);
        } else if (!selectedSubCategory) {
            setSelectedSubCategory(category);
        } else {
            // You can add a third level or trigger final action here
            console.log('Selected Final Category:', category);
            setOpenDialog(false);
        }
    };

    const renderCategoryCard = (item) => (
        <button
            key={item.id}
            type="button"
            onClick={() => handleCategoryClick(item)}
            className={`${finalSelect?.code == item?.code && 'border-primary'} group bg-background hover:border-primary flex h-full flex-col items-center justify-center gap-2 rounded-xl border px-2 py-2 transition-all duration-300 hover:shadow-sm`}
        >
            {item.image && (
                <img
                    src={`/assets/images/item_categories/thumb/${item.image}`}
                    alt={`Category ${item.name}`}
                    className="h-13 w-13 object-contain transition-transform duration-300 group-hover:scale-115"
                />
            )}
            <p className="text-muted-foreground group-hover:text-primary text-center text-sm font-medium dark:text-white">
                {currentLocale === 'kh' ? item.name_kh : item.name}
            </p>
        </button>
    );

    return (
        <div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="h-[37px] w-full">
                        {finalSelect ? (
                            <div className="flex items-center gap-2">
                                <>
                                    {finalSelect?.image && (
                                        <img
                                            src={`/assets/images/item_categories/thumb/${finalSelect?.image}`}
                                            alt={`Category ${finalSelect?.name}`}
                                            className="size-7 object-contain transition-transform duration-300 group-hover:scale-115"
                                        />
                                    )}
                                    <p className="text-muted-foreground group-hover:text-primary text-center text-sm font-bold dark:text-white">
                                        {currentLocale === 'kh' ? finalSelect?.name_kh : finalSelect?.name}
                                    </p>
                                </>
                            </div>
                        ) : (
                            <p className="w-full text-start">Select Category</p>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] p-4 sm:max-w-[825px]">
                    <DialogHeader>
                        <CategorySelectBreadcrumb
                            selectedCategory={selectedCategory}
                            selectedSubCategory={selectedSubCategory}
                            setSelectedCategory={setSelectedCategory}
                            setSelectedSubCategory={setSelectedSubCategory}
                            setFinalSelect={setFinalSelect}
                        />
                        <Separator />
                        <p>
                            Selected : <strong>{finalSelect?.name}</strong>
                        </p>
                        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
                            {getCategoriesToRender().map(renderCategoryCard)}
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CategorySelect;
