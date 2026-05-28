import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  useBusesSlice,
  useGetBusesQuery,
  useCreateBusMutation,
  useUpdateBusMutation,
  useDeleteBusMutation,
  useUploadDriverPhotoMutation,
  useUploadDrivingLicenseMutation,
  useUploadBusPhotoMutation,
} from './slice';
import { useOperatorsSlice, useGetOperatorsQuery } from '../Operators/slice';
import { Bus } from './slice/types';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Label from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import { Plus, Pencil, Trash2, Filter, ImagePlus, UploadCloud, FileBadge2, Loader2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/sheet';
import { ConfirmationDialog } from '../../components/ui/confirmation-dialog';
import useDebounce from 'utils/hooks/debounce-hook';

const actionButtonBase =
  'h-12 rounded-xl px-5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2';

export function Buses() {
  const { actions } = useBusesSlice();
  useOperatorsSlice(); // inject operators slice to useGetOperatorsQuery

  const { toast } = useToast();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const [page, setPage] = useState(1);
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    search: '',
    seats: '',
    bus_type: ''
  });
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    seats: '',
    bus_type: ''
  });

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  useEffect(() => {
    if (activeFilters.search !== debouncedSearchTerm) {
      setActiveFilters((prev) => ({ ...prev, search: debouncedSearchTerm }));
      setTempFilters((prev) => ({ ...prev, search: debouncedSearchTerm }));
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  const { data: busesResponse, isLoading, refetch } = useGetBusesQuery({ 
    page, 
    limit: 10,
    search: activeFilters.search || undefined,
    seats: activeFilters.seats || undefined,
    bus_type: activeFilters.bus_type || undefined
  });
  const { data: operatorsResponse } = useGetOperatorsQuery();

  const [createBus, { isLoading: isCreating }] = useCreateBusMutation();
  const [updateBus, { isLoading: isUpdating }] = useUpdateBusMutation();
  const [deleteBus, { isLoading: isDeleting }] = useDeleteBusMutation();
  const [uploadDriverPhoto, { isLoading: isDriverPhotoUploading }] = useUploadDriverPhotoMutation();
  const [uploadDrivingLicense, { isLoading: isLicenseUploading }] = useUploadDrivingLicenseMutation();
  const [uploadBusPhoto] = useUploadBusPhotoMutation();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  const [formData, setFormData] = useState<{
    bus_name: string;
    bus_number: string;
    bus_type: string;
    total_seats: string | number;
    operator: string;
    amenities: string;
    driver_photo: string;
    driving_license: string;
    photos?: string[];
  }>({
    bus_name: '',
    bus_number: '',
    bus_type: '',
    total_seats: '40',
    operator: '',
    amenities: '',
    driver_photo: '',
    driving_license: '',
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (images: string[]) => {
    setLightboxImages(images);
    setCurrentImageIndex(0);
    setLightboxOpen(true);
  };

  const openSingleImage = (imageUrl: string) => {
    openLightbox([imageUrl]);
  };

  const formatSeatsForTable = (value: string | number) => {
    if (typeof value === 'string') {
      return value;
    }

    if (value === 30) {
      return '15 bearths up & down';
    }

    return value;
  };

  const [selectedDriverPhotoName, setSelectedDriverPhotoName] = useState('');
  const [driverPhotoUploadError, setDriverPhotoUploadError] = useState('');
  const [selectedLicenseName, setSelectedLicenseName] = useState('');
  const [licenseUploadError, setLicenseUploadError] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  const handleOpenSheet = (bus?: Bus) => {
    if (bus) {
      setEditingBus(bus);
      
      let seatsStr = bus.total_seats.toString();
      if (bus.total_seats === 25) seatsStr = "25 seats";
      else if (bus.total_seats === 50) seatsStr = "50 seats";
      else if (bus.total_seats === 30) seatsStr = "15 bearths up & down";
      
      setFormData({
        bus_name: bus.bus_name,
        bus_number: bus.bus_number,
        bus_type: bus.bus_type,
        total_seats: seatsStr,
        operator: bus.operator?._id || bus.operator,
        amenities: bus.amenities.join(', '),
        driver_photo: bus.driver_photo || '',
        driving_license: bus.driving_license || '',
        photos: bus.photos || [],
      });
    } else {
      setEditingBus(null);
      setFormData({
        bus_name: '',
        bus_number: '',
        bus_type: '',
        total_seats: '40',
        operator: '',
        amenities: '',
        driver_photo: '',
        driving_license: '',
        photos: [],
      });
      setSelectedDriverPhotoName('');
      setDriverPhotoUploadError('');
      setSelectedLicenseName('');
      setLicenseUploadError('');
    }
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingBus(null);
  };

  const validateImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload a valid image file.';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'Image must be smaller than 5 MB.';
    }
    return '';
  };

  const onDriverPhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileError = validateImageFile(file);
    if (fileError) {
      setDriverPhotoUploadError(fileError);
      return;
    }

    setDriverPhotoUploadError('');
    setSelectedDriverPhotoName(file.name);

    try {
      const uploadResult = await uploadDriverPhoto(file).unwrap();
      setFormData(prev => ({ ...prev, driver_photo: uploadResult.imageUrl }));
      toast({
        variant: 'success',
        title: 'Driver photo uploaded',
        description: 'Image uploaded and ready to be saved.',
      });
    } catch (error: any) {
      setDriverPhotoUploadError(error?.data?.message || error?.message || 'Failed to upload photo.');
    } finally {
      event.target.value = '';
    }
  };

  const onDrivingLicenseChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileError = validateImageFile(file);
    if (fileError) {
      setLicenseUploadError(fileError);
      return;
    }

    setLicenseUploadError('');
    setSelectedLicenseName(file.name);

    try {
      const uploadResult = await uploadDrivingLicense(file).unwrap();
      setFormData(prev => ({ ...prev, driving_license: uploadResult.imageUrl }));
      toast({
        variant: 'success',
        title: 'Driving license uploaded',
        description: 'Image uploaded and ready to be saved.',
      });
    } catch (error: any) {
      setLicenseUploadError(error?.data?.message || error?.message || 'Failed to upload license.');
    } finally {
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBus && !formData.driver_photo?.trim()) {
      toast({ title: 'Error', description: 'Please upload a driver photo.', variant: 'destructive' });
      return;
    }

    if (!editingBus && !formData.driving_license?.trim()) {
      toast({ title: 'Error', description: 'Please upload driving license.', variant: 'destructive' });
      return;
    }

    let finalSeats = 40;
    if (formData.total_seats === "25 seats") finalSeats = 25;
    else if (formData.total_seats === "50 seats") finalSeats = 50;
    else if (formData.total_seats === "15 bearths up & down") finalSeats = 30;
    else if (formData.total_seats === "25 bearths up & down") finalSeats = 50;
    else if (typeof formData.total_seats === 'number') finalSeats = formData.total_seats;
    else finalSeats = parseInt(formData.total_seats as string) || 40;

    const payload = {
      ...formData,
      total_seats: finalSeats,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
    };

    try {
      if (editingBus) {
        await updateBus({ id: editingBus._id, ...payload }).unwrap();
        toast({ title: 'Success', description: 'Bus updated successfully' });
      } else {
        await createBus(payload).unwrap();
        toast({ title: 'Success', description: 'Bus created successfully' });
      }
      handleCloseSheet();
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Operation failed', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBus(deleteId).unwrap();
      toast({ title: 'Success', description: 'Bus deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error || 'Failed to delete bus', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const onBusPhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingPhotos(true);
      const uploadPromises = Array.from(files).map(file => uploadBusPhoto(file).unwrap());
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(res => res.imageUrl);
      
      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...imageUrls],
      }));
      toast({ title: 'Photos uploaded successfully' });
    } catch (error) {
      toast({ title: 'Error uploading photos', variant: 'destructive' });
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const removeBusPhoto = (photoIndex: number) => {
    setFormData(prev => {
      const existingPhotos = [...(prev.photos || [])];
      existingPhotos.splice(photoIndex, 1);
      return { ...prev, photos: existingPhotos };
    });
  };

  return (
    <>
      <Helmet>
        <title>Buses</title>
      </Helmet>
      
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Buses Management</h1>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input 
                placeholder="Search buses, operators..." 
                className="h-12 w-[280px] pl-10 pr-4 text-base rounded-xl border-slate-300 focus:border-[#0077b6] focus:ring-[#0077b6] transition-all shadow-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 px-5 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 transition-all font-semibold shadow-sm">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                  {(activeFilters.seats || activeFilters.bus_type) && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0077b6] text-xs text-white">
                      {[activeFilters.seats, activeFilters.bus_type].filter(Boolean).length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[420px] bg-white p-8 space-y-7 shadow-2xl rounded-2xl border-slate-200" align="end" sideOffset={12}>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Total Seats / Layout</Label>
                  <Select 
                    value={tempFilters.seats || "all"} 
                    onValueChange={(val) => setTempFilters({ ...tempFilters, seats: val === "all" ? "" : val })}
                  >
                    <SelectTrigger className="h-14 text-base px-5 rounded-xl border-slate-300 focus:border-[#0077b6] focus:ring-[#0077b6] transition-all shadow-sm">
                      <SelectValue placeholder="All Seats" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200 p-1">
                      <SelectItem value="all" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">All Seats</SelectItem>
                      <SelectItem value="25 seats" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">25 seats</SelectItem>
                      <SelectItem value="50 seats" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">50 seats</SelectItem>
                      <SelectItem value="15 bearths up & down" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">15 bearths up & down</SelectItem>
                      <SelectItem value="25 bearths up & down" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">25 bearths up & down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Bus Type</Label>
                  <Select 
                    value={tempFilters.bus_type || "all"} 
                    onValueChange={(val) => setTempFilters({ ...tempFilters, bus_type: val === "all" ? "" : val })}
                  >
                    <SelectTrigger className="h-14 text-base px-5 rounded-xl border-slate-300 focus:border-[#0077b6] focus:ring-[#0077b6] transition-all shadow-sm">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-xl border-slate-200 p-1">
                      <SelectItem value="all" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">All Types</SelectItem>
                      <SelectItem value="semi sleeper" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">Semi Sleeper</SelectItem>
                      <SelectItem value="sleeper" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">Sleeper</SelectItem>
                      <SelectItem value="mini bus" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">Mini Bus</SelectItem>
                      <SelectItem value="tour bus/charter" className="cursor-pointer py-3 rounded-lg text-base hover:bg-slate-50 focus:bg-slate-50">Tour Bus / Charter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-6 flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-14 rounded-xl font-bold text-base text-slate-600 border-2 border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all active:scale-[0.98]"
                    onClick={() => {
                      setTempFilters({ search: '', seats: '', bus_type: '' });
                      setSearchInput('');
                      setActiveFilters({ search: '', seats: '', bus_type: '' });
                      setIsFiltersOpen(false);
                      setPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button 
                    className="flex-1 h-14 bg-[#0077b6] hover:bg-[#036aa0] hover:-translate-y-0.5 text-white rounded-xl font-bold text-base shadow-lg transition-all active:scale-[0.98]"
                    onClick={() => {
                      setActiveFilters(tempFilters);
                      setIsFiltersOpen(false);
                      setPage(1);
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="rounded-md border bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500">Bus Name</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Number</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Seats</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Operator</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Photos</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Driver Photo</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Driving License</th>
                  <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(isLoading || isInitialLoading) ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-1/2" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-2/3" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-8" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-3/4" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-10 rounded-lg" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-10 rounded-lg" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-10 rounded-lg" /></td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-20 rounded-md" />
                      </td>
                    </tr>
                  ))
                ) : busesResponse?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No buses found.
                    </td>
                  </tr>
                ) : (
                  busesResponse?.data.map((bus) => (
                    <tr key={bus._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{bus.bus_name}</td>
                      <td className="px-6 py-4">{bus.bus_number}</td>
                      <td className="px-6 py-4">{bus.bus_type}</td>
                      <td className="px-6 py-4">{formatSeatsForTable(bus.total_seats)}</td>
                      <td className="px-6 py-4">{bus.operator?.operator_name || 'N/A'}</td>
                      <td className="px-6 py-4">
                        {bus.photos && bus.photos.length > 0 ? (
                          <div 
                            className="flex -space-x-3 cursor-pointer transition-transform hover:scale-105"
                            title="Open images"
                            onClick={() => openLightbox(bus.photos!)}
                          >
                            {bus.photos.slice(0, 3).map((photo, i) => (
                              <img 
                                key={i} 
                                src={photo} 
                                alt={`Bus photo ${i}`} 
                                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
                              />
                            ))}
                            {bus.photos.length > 3 && (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 z-10">
                                +{bus.photos.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No photos</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {bus.driver_photo ? (
                          <button
                            type="button"
                            className="rounded-lg transition-transform hover:scale-105"
                            onClick={() => openSingleImage(bus.driver_photo!)}
                            title="Open driver photo"
                          >
                            <img
                              src={bus.driver_photo}
                              alt={`${bus.bus_name} driver`}
                              className="h-10 w-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                            />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {bus.driving_license ? (
                          <button
                            type="button"
                            className="rounded-lg transition-transform hover:scale-105"
                            onClick={() => openSingleImage(bus.driving_license!)}
                            title="Open driving license"
                          >
                            <img
                              src={bus.driving_license}
                              alt={`${bus.bus_name} license`}
                              className="h-10 w-10 rounded-lg object-cover border border-slate-200 shadow-sm"
                            />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-11 w-11 rounded-md border-[#1e3a8a]/70 bg-[#1e3a8a]/70 text-white shadow-sm hover:border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white" onClick={() => handleOpenSheet(bus)} title="Edit bus" aria-label="Edit bus">
                          <Pencil className="h-4.5 w-4.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-11 w-11 rounded-md border-[#991b1b]/70 bg-[#991b1b]/70 text-white shadow-sm hover:border-[#991b1b] hover:bg-[#991b1b] hover:text-white" onClick={() => setDeleteId(bus._id)} title="Delete bus" aria-label="Delete bus">
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-[400px] sm:w-[540px] overflow-y-auto"
          onPointerDownOutside={e => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>{editingBus ? 'Edit Bus' : 'Add New Bus'}</SheetTitle>
          </SheetHeader>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            onClick={handleCloseSheet}
            aria-label="Close bus form"
            title="Close"
          >
            <X className="h-5 w-5" />
          </Button>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bus_name">Bus Name</Label>
              <Input
                id="bus_name"
                required
                value={formData.bus_name}
                onChange={e => setFormData({ ...formData, bus_name: e.target.value })}
                placeholder="e.g. SRS Travels Express"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bus_number">Bus Number</Label>
              <Input
                id="bus_number"
                required
                value={formData.bus_number}
                onChange={e => setFormData({ ...formData, bus_number: e.target.value })}
                placeholder="e.g. KA 01 AB 1234"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bus_type">Bus Type</Label>
              <Select 
                value={formData.bus_type} 
                onValueChange={(val) => setFormData({ ...formData, bus_type: val })}
                required
              >
                <SelectTrigger id="bus_type" className="h-[5rem]">
                  <SelectValue placeholder="Select Bus Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="semi sleeper">Semi Sleeper</SelectItem>
                  <SelectItem value="sleeper">Sleeper</SelectItem>
                  <SelectItem value="mini bus">Mini Bus</SelectItem>
                  <SelectItem value="tour bus/charter">Tour Bus / Charter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_seats">Total Seats</Label>
              <Select 
                value={formData.total_seats?.toString()} 
                onValueChange={(val) => setFormData({ ...formData, total_seats: val })}
                required
              >
                <SelectTrigger id="total_seats" className="h-[5rem]">
                  <SelectValue placeholder="Select Total Seats" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="25 seats">25 seats</SelectItem>
                  <SelectItem value="50 seats">50 seats</SelectItem>
                  <SelectItem value="15 bearths up & down">15 bearths up & down</SelectItem>
                  <SelectItem value="25 bearths up & down">25 bearths up & down</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma separated)</Label>
              <Input
                id="amenities"
                value={formData.amenities}
                onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="e.g. WiFi, Water Bottle, Blanket"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver_photo_upload">Driver Photo</Label>
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-slate-50 p-4">
                <div className="h-40 w-40 overflow-hidden rounded-2xl border bg-white shadow-sm">
                  {formData.driver_photo ? (
                    <img src={formData.driver_photo} alt="Driver avatar" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-slate-400">
                      <ImagePlus className="size-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-[240px] flex-1 space-y-1">
                  <p className="text-sm font-medium text-slate-700">{selectedDriverPhotoName || 'Upload driver photo'}</p>
                  <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 5MB</p>
                  {driverPhotoUploadError && <p className="text-xs font-medium text-rose-600">{driverPhotoUploadError}</p>}
                </div>
                <Button
                  type="button" variant="outline" className="h-12 min-w-[220px] rounded-xl border-sky-200 bg-sky-50 text-sky-700 shadow-sm hover:bg-sky-100"
                  onClick={() => document.getElementById('driver_photo_upload')?.click()}
                  disabled={isDriverPhotoUploading || isCreating || isUpdating}
                >
                  {isDriverPhotoUploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <UploadCloud className="mr-2 size-4" />}
                  {isDriverPhotoUploading ? 'Uploading...' : 'Choose Driver Photo'}
                </Button>
                {formData.driver_photo && (
                  <Button
                    type="button" variant="outline" className="h-11 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
                    onClick={() => { setFormData(prev => ({ ...prev, driver_photo: '' })); setSelectedDriverPhotoName(''); setDriverPhotoUploadError(''); }}
                  >
                    <Trash2 className="mr-2 size-4" /> Remove
                  </Button>
                )}
                <input id="driver_photo_upload" type="file" accept="image/*" className="hidden" onChange={onDriverPhotoChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driving_license_upload">Driving License</Label>
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-slate-50 p-4">
                <div className="size-24 overflow-hidden rounded-2xl border bg-white shadow-sm">
                  {formData.driving_license ? (
                    <img src={formData.driving_license} alt="Driving license" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-slate-400">
                      <FileBadge2 className="size-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-[240px] flex-1 space-y-1">
                  <p className="text-sm font-medium text-slate-700">{selectedLicenseName || 'Upload driving license'}</p>
                  <p className="text-xs text-slate-500">JPG, PNG, WEBP up to 5MB</p>
                  {licenseUploadError && <p className="text-xs font-medium text-rose-600">{licenseUploadError}</p>}
                </div>
                <Button
                  type="button" variant="outline" className="h-12 min-w-[220px] rounded-xl border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm hover:bg-indigo-100"
                  onClick={() => document.getElementById('driving_license_upload')?.click()}
                  disabled={isLicenseUploading || isCreating || isUpdating}
                >
                  {isLicenseUploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <UploadCloud className="mr-2 size-4" />}
                  {isLicenseUploading ? 'Uploading...' : 'Choose Driving License'}
                </Button>
                {formData.driving_license && (
                  <Button
                    type="button" variant="outline" className="h-11 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50"
                    onClick={() => { setFormData(prev => ({ ...prev, driving_license: '' })); setSelectedLicenseName(''); setLicenseUploadError(''); }}
                  >
                    <Trash2 className="mr-2 size-4" /> Remove
                  </Button>
                )}
                <input id="driving_license_upload" type="file" accept="image/*" className="hidden" onChange={onDrivingLicenseChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bus Photos</Label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-12 px-6 text-base"
                    onClick={() => document.getElementById('bus_photos_upload')?.click()}
                  >
                    <UploadCloud className="mr-2 h-5 w-5" />
                    Upload Photos
                  </Button>
                  <input
                    id="bus_photos_upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onBusPhotosChange}
                  />
                  <span className="text-sm text-slate-500">
                    {formData.photos?.length || 0} photo(s) selected
                  </span>
                </div>
                {(formData.photos && formData.photos.length > 0) || isUploadingPhotos ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.photos?.map((photoUrl, pIndex) => (
                      <div key={pIndex} className="relative group">
                        <img
                          src={photoUrl}
                          alt={`Bus Photo ${pIndex}`}
                          className="h-16 w-16 rounded-md object-cover border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeBusPhoto(pIndex)}
                          className="absolute -top-2 -right-2 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {isUploadingPhotos && (
                      <Skeleton className="h-16 w-16 rounded-md" />
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" className={`${actionButtonBase} border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300`} onClick={handleCloseSheet}>
                Cancel
              </Button>
              <Button type="submit" className={`${actionButtonBase} bg-[#0077b6] text-white hover:-translate-y-0.5 hover:bg-[#036aa0] focus-visible:ring-[#0077b6]/50`} disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? 'Saving...' : 'Save Bus'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete Bus"
        description="Are you sure you want to delete this bus? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isConfirming={isDeleting}
      />

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity" onClick={() => setLightboxOpen(false)}>
          <button
            className="absolute right-4 top-4 text-white hover:text-gray-300 z-50 p-2"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          
          {lightboxImages.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-300 z-50 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-300 z-50 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImages[currentImageIndex]}
              alt={`Bus full size ${currentImageIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} / {lightboxImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
