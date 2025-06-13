<?php

use App\Models\Banner;
use App\Models\Page;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Route::get('/western_layout123', function(){
//     return Inertia::render('westernuniversity/layout/layout');
// });

Route::get('/', function () {
return Inertia::render('westernUniversityNew/Home');
});

Route::get('/contact', function () {
    return Inertia::render('westernUniversityNew/Contact');
});

Route::get('/history_and_values', function () {
        return Inertia::render('westernUniversityNew/About/HistoryAndValues');
});

Route::get('/campuses', function () {
    return Inertia::render('westernUniversityNew/About/Campuses');
});

Route::get('/school_facilities', function () {
    return Inertia::render('westernUniversityNew/About/SchoolFacilities');
});

Route::get('/student_council', function () {
    return Inertia::render('westernUniversityNew/About/StudentCouncil');
});

Route::get('/curriculum', function () {
    return Inertia::render('westernUniversityNew/Academics/Curriculum');
});

Route::get('/school_calendar', function () {
    return Inertia::render('westernUniversityNew/Academics/SchoolCalendars');
});

Route::get('/programs', function () {
    return Inertia::render('westernUniversityNew/Academics/Programs');
});

Route::get('/class_schedules_and_subjects', function () {
    return Inertia::render('westernUniversityNew/Academics/ClassScheduleAndSubject');
});

Route::get('/admissions', function () {
    return Inertia::render('westernUniversityNew/Admission/Index');
});

Route::get('/news', function () {
    return Inertia::render('westernUniversityNew/SchoolLife/News');
});
Route::get('/activities_and_events', function () {
    return Inertia::render('westernUniversityNew/SchoolLife/ActivitiesAndEvents');
});
Route::get('/extracurricular_activities', function () {
    return Inertia::render('westernUniversityNew/SchoolLife/ExtracurricularActivities');
});

Route::get('/outreach_programs', function () {
    return Inertia::render('westernUniversityNew/SchoolLife/OutreachPrograms');
});

Route::get('/programs/detail/{id}', function ($id) {
    return Inertia::render('westernUniversityNew/Academics/Detail', [
        'id' => $id,
    ]);
});
// Route::get('/hestory_and_values', function () {
//     $ourHistory = Page::where('code', 'OUR_HESTORY')->with('images')->first();
//     $ourVision = Page::where('code', 'OUR_VISION')->with('images')->first();
//     $ourMission = Page::where('code', 'OUR_MISSION')->first();
//     $ourHistoryBanner = Banner::where('position_code', 'HESTORY_AND_VALUES')->first();
//     $timeLine = Page::where('code', 'TIME_LINE')
//         ->with(['children.images']) // Eager load images for children
//         ->first();
//     $valuesWiscare = Page::where('code', 'VALUES_WISCARE')
//         ->with(['children.images']) // Eager load images for children
//         ->first();

//     // return ($ourHistoryBanner);
//     return Inertia::render('westernuniversity/about/HestoryAndValues', [
//         'ourHistory' => $ourHistory,
//         'timeLine' => $timeLine,
//         'ourVision' => $ourVision,
//         'ourMission' => $ourMission,
//         'valuesWiscare' => $valuesWiscare,
//         'ourHistoryBanner' => $ourHistoryBanner,

//     ]);
// });
// Route::get('/school_facilities', function () {
//     $schoolFacilityBanner = Banner::where('position_code', 'SCHOOL_FACILITIES')->first();
//     $schoolFacilities = Page::where('code', 'SCHOOL_FACILITIES')
//         ->with(['children.images']) // Eager load images for children
//         ->first();
//     // return($schoolFacilityBanner);
//     return Inertia::render('westernuniversity/about/SchoolFacilities', [
//         'schoolFacilityBanner' => $schoolFacilityBanner,
//         'schoolFacilities' => $schoolFacilities,
//     ]);
// });
// Route::get('/campuses', function () {
//     $campuseBanner = Banner::where('position_code', 'CAMPUSES')->first();
//     return Inertia::render('westernuniversity/about/Campuses', [
//         'campuseBanner' => $campuseBanner,
//     ]);
// })->name('campuses');
// Route::get('/detail/{id}', function ($id) {
//     return Inertia::render('westernuniversity/about/Detail', [
//         'id' => $id,
//     ]);
// })->name('detail');


// // Academic
// Route::get('/curriculum', function () {
//     $curriculumBanner = Banner::where('position_code', 'CURRICULUM')->first();
//     $curriculum = Page::where('code', 'CURRICULUM')->with('images')->first();
//     // return($curriculum);
//     return Inertia::render('westernuniversity/academic/Curriculum', [
//         'curriculumBanner' => $curriculumBanner,
//         'curriculum' => $curriculum,

//     ]);
// });
// Route::get('/programs', function () {
//     $programBanner = Banner::where('position_code', 'PROGRAMS')->first();
//     $programs = Page::where('code', 'PROGRAMS')
//         ->with(['children.images']) // Eager load images for children
//         ->first();
//     // return($programBanner);
//     return Inertia::render('westernuniversity/academic/Programs', [
//         'programBanner' => $programBanner,
//         'programs' => $programs,

//     ]);
// });
// Route::get('/schedules_and_subjects', function () {
//     return Inertia::render('westernuniversity/academic/ScheduleAndSubjects');
// })->name('schedules_and_subjects');

// Route::get('/admissions', function () {
//     $admissionBanner = Banner::where('position_code', 'ADMISSIONS')->first();
//     $admission = Page::where('code', 'ADMISSIONS')
//         ->with(['children.images']) // Eager load images for children
//         ->first();
//     // return($admission);
//     $table = Page::where('code', 'SCHOOL_FEES_TABLE')
//         ->with(['children.images']) // Eager load images for children
//         ->first();
//     return Inertia::render('westernuniversity/admissions/Index', [
//         'admissionBanner' => $admissionBanner,
//         'admission' => $admission,
//         'table' => $table,
//     ]);
// });

// Route::get('/activities_and_events', function () {
//     $banner = Banner::where('position_code', 'SCHOOL_ACTIVITIES_AND_EVENT')->first();
//     $dataPage = Page::where('code', 'SCHOOL_ACTIVITIES_AND_EVENTS')->first();
//     $activitiesAndEventsTopData = Page::where('position_code', 'SCHOOL_ACTIVITIES_AND_EVENT_TOP')->with('images')->get();
//     $activitiesAndEventsBottomData = Page::where('position_code', 'SCHOOL_ACTIVITIES_AND_EVENT_BOTTOM')->with('images')->get();
//         // return $activitiesAndEventsBottomData;
//     return Inertia::render('westernuniversity/school_life/ActivitiesAndEvents', [
//         'banner' => $banner,
//         'dataPage' => $dataPage,
//         'activitiesAndEventsTopData' => $activitiesAndEventsTopData,
//         'activitiesAndEventsBottomData' => $activitiesAndEventsBottomData,

//     ]);
// });

// Route::get('/extracurricular_activities', function () {
//     $banner = Banner::where('position_code', 'Extracurricular_Activities')->first();
//     $dataPage = Page::where('code', 'EXTRACURRICULAR_ACTIVITIES')->first();
//     $TopData = Page::where('position_code', 'EXTRACURRICULAR_ACTIVITIES_TOP')->with('images')->get();
//     $BottomData = Page::where('position_code', 'EXTRACURRICULAR_ACTIVITIES_BOTTOM')->with('images')->get();
//     return Inertia::render('westernuniversity/school_life/ExtracurricularActivities',[
//         'banner' => $banner,
//         'dataPage' => $dataPage,
//         'topData' => $TopData,
//         'bottomData' => $BottomData,
//     ]);
// });

// Route::get('/outreach_programs', function () {
//     $banner = Banner::where('position_code', 'OUTREACH_PROGRAMS')->first();
//     $outreachProgramData = Page::where('code', 'OUTREACH_PROGRAMS')
//         ->with(['children.images']) // Eager load images for children
//         ->first();
//         // return $outreachProgramData;
//     return Inertia::render('westernuniversity/school_life/OutreachPrograms',[
//         'banner' => $banner,
//         'outreachProgramData' => $outreachProgramData,
//     ]);
// })->name('outreach_programs');

// Route::get('/student_council', function () {
//     return Inertia::render('westernuniversity/school_life/StudentCouncil');
// })->name('student_council');

// Route::get('/news_and_blogs', function () {
//     return Inertia::render('westernuniversity/school_life/NewsAndBlogs');
// })->name('news_and_blogs');

// Route::get('/contact', function () {
//     return Inertia::render('westernuniversity/contact/Contact');
// })->name('contact');

// Route::get('/careers', function () {
//     return Inertia::render('westernuniversity/contact/Careers');
// })->name('careers');
