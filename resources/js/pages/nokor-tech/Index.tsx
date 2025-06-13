import MyNoData from '@/components/my-no-data';
import { usePage } from '@inertiajs/react';
import MyBlogList from './components/my-blogs-list';
import MyCategoryList from './components/my-category-list';
import MyMiddleSlide from './components/my-middle-slide';
import MyProductList from './components/my-product-list';
import MyProductListHeader from './components/my-product-list-header';
import MySlide from './components/my-slide';
import NokorTechLayout from './layouts/nokor-tech-layout';

const Index = () => {
    const { topBanners, middleBanners, posts, newArrivals, categoriesWithItems } = usePage<any>().props;
    return (
        <NokorTechLayout>
            <main className="px-2">
                <>
                    <div className="mx-auto mb-10 max-w-screen-xl">
                        {topBanners?.length > 0 && <MySlide slides={topBanners} path="/assets/images/banners/thumb/" />}
                        {/* end slide */}
                        <div className="mt-10 mb-4 space-y-4">
                            {categoriesWithItems?.length > 0 && <MyCategoryList items={categoriesWithItems} />}
                        </div>

                        {newArrivals?.length > 0 ? (
                            <>
                                <MyProductListHeader title="New Arrivals" link="/products" />
                                <MyProductList items={newArrivals} />
                            </>
                        ) : (
                            <MyNoData />
                        )}

                        {middleBanners?.length > 0 && <MyMiddleSlide slides={middleBanners} path="/assets/images/banners/thumb/" />}

                        {categoriesWithItems
                            .filter((category: any) => category.all_items.length > 0)
                            .map((category: any) => (
                                <div key={category.id}>
                                    <MyProductListHeader
                                        link={`/products?category_code=${category?.code}`}
                                        title={category.name}
                                        image={`/assets/images/item_categories/thumb/${category.image}`}
                                    />
                                    <MyProductList items={category.all_items} />
                                </div>
                            ))}

                        {posts?.length > 0 && (
                            <>
                                <MyProductListHeader title="Blogs" />
                                <MyBlogList posts={posts} />
                            </>
                        )}
                    </div>
                    {/* <MyService /> */}
                </>
            </main>
        </NokorTechLayout>
    );
};

export default Index;
