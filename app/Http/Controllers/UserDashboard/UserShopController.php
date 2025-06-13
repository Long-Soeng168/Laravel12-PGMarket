<?php

namespace App\Http\Controllers\UserDashboard;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;

class UserShopController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('role:Shop', only: ['edit', 'update', 'update_status']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function edit()
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('shop_id', null)
            ->get();
        $user_shop = Shop::findOrFail(Auth::user()->shop_id);
        if ($user_shop->id != Auth::user()->shop_id) {
            abort(404);
        }
        // return ($all_users);
        return Inertia::render('user-dashboard/shops/Create', [
            'editData' => $user_shop->load('owner'),
            'all_users' => $all_users,
        ]);
    }
    public function create()
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('shop_id', null)
            ->get();
        $user_shop = Shop::find(Auth::user()->shop_id);
        if ($user_shop) {
            abort(403);
        }
        // return ($all_users);
        return Inertia::render('user-dashboard/shops/Create', [
            'all_users' => $all_users,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $user_shop = Shop::find(Auth::user()->shop_id);
        if ($user_shop) {
            abort(403);
        }

        $validated['owner_user_id'] = $request->user()->id;
        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('logo');
        $banner_file = $request->file('banner');
        unset($validated['logo']);
        unset($validated['banner']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }


        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/shops', 600);
                $validated['logo'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/shops', 1200);
                $validated['banner'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $shop = Shop::create($validated);

        if ($shop) {
            $user = User::where('id', Auth::user()->id)->where('shop_id', null)->first();
            $user->assignRole('Shop');
            if ($user)
                $user->update([
                    'shop_id' => $shop->id,
                ]);
        }

        return redirect('/user-dashboard')->with('success', 'Shop register successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Shop $user_shop)
    {
        if ($user_shop->id != Auth::user()->shop_id) {
            abort(404);
        }

        $validated = $request->validate([
            'owner_user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;

        if ($validated['owner_user_id'] != $user_shop->owner_user_id) {
            User::where('id', $user_shop->owner_user_id)->update([
                'shop_id' => null,
            ]);
        }

        $image_file = $request->file('logo');
        $banner_file = $request->file('banner');
        unset($validated['logo']);
        unset($validated['banner']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/shops', 600);
                $validated['logo'] = $created_image_name;

                if ($user_shop->logo && $created_image_name) {
                    ImageHelper::deleteImage($user_shop->logo, 'assets/images/shops');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/shops', 1200);
                $validated['banner'] = $created_image_name;

                if ($user_shop->banner && $created_image_name) {
                    ImageHelper::deleteImage($user_shop->banner, 'assets/images/shops');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $updated_success = $user_shop->update($validated);

        if ($updated_success) {
            $user = User::where('id', $validated['owner_user_id'])->where('shop_id', null)->first();
            if ($user)
                $user->update([
                    'shop_id' => $user_shop->id,
                ]);
        }


        return redirect()->back()->with('success', 'Shop updated successfully!');
    }


    public function update_status(Request $request, Shop $user_shop)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $user_shop->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shop $user_shop)
    {
        if ($user_shop->logo) {
            ImageHelper::deleteImage($user_shop->logo, 'assets/images/shops');
        }
        if ($user_shop->banner) {
            ImageHelper::deleteImage($user_shop->banner, 'assets/images/shops');
        }
        $user_shop->delete();
        return redirect()->back()->with('success', 'Shop deleted successfully.');
    }
}
