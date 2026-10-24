"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Percent,
  CircleDollarSign,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "@/redux/api/couponApi";

interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { data: resData, isLoading, isFetching, refetch } = useGetAllCouponsQuery(undefined);
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const coupons: Coupon[] = resData?.data || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "fixed" as "fixed" | "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    maxUses: 0,
    expiryDate: "",
    isActive: true,
  });

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      description: "",
      discountType: "fixed",
      discountValue: 100,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      maxUses: 100,
      expiryDate: "",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      maxUses: coupon.maxUses || 0,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.split("T")[0] : "",
      isActive: coupon.isActive,
    });
    setModalOpen(true);
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      const res: any = await updateCoupon({
        id: coupon._id,
        isActive: !coupon.isActive,
      }).unwrap();
      toast.success(res?.message || `কুপন ${!coupon.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে`);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${code}" কুপনটি ডিলিট করতে চান?`)) return;
    try {
      const res: any = await deleteCoupon(id).unwrap();
      toast.success(res?.message || "কুপন সফলভাবে ডিলিট হয়েছে");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "কুপন ডিলিট করা যায়নি");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error("কুপন কোড প্রদান করা আবশ্যক");
      return;
    }
    if (formData.discountValue <= 0) {
      toast.error("ছাড়ের পরিমাণ ০ এর বেশি হতে হবে");
      return;
    }

    try {
      const payload: any = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxUses: Number(formData.maxUses) || undefined,
        isActive: formData.isActive,
      };

      if (formData.discountType === "percentage" && formData.maxDiscountAmount > 0) {
        payload.maxDiscountAmount = Number(formData.maxDiscountAmount);
      }

      if (formData.expiryDate) {
        payload.expiryDate = new Date(formData.expiryDate).toISOString();
      } else {
        payload.expiryDate = null;
      }

      if (editingCoupon) {
        const res: any = await updateCoupon({
          id: editingCoupon._id,
          ...payload,
        }).unwrap();
        toast.success(res?.message || "কুপন সফলভাবে আপডেট হয়েছে");
        setModalOpen(false);
      } else {
        const res: any = await createCoupon(payload).unwrap();
        toast.success(res?.message || "কুপন সফলভাবে তৈরি হয়েছে");
        setModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "কুপন সংরক্ষণ করা যায়নি");
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const saving = isCreating || isUpdating;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-7 h-7 text-blue-600" /> কুপন ও ডিসকাউন্ট ম্যানেজমেন্ট
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            কোর্স ও কম্বো অর্ডারে স্পেশাল প্রোমো কোড, ফ্ল্যাট ছাড় এবং মেয়াদ সেট করুন
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" /> নতুন কুপন তৈরি করুন
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="কুপন কোড বা বিবরণ খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} /> রিফ্রেশ
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>কুপন লোড হচ্ছে...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">কোনো কুপন পাওয়া যায়নি</p>
            <p className="text-sm text-slate-400 mt-1">
              {searchTerm ? "সার্চের সাথে মেলেনি এমন কোনো কুপন নেই" : "এখনই নতুন একটি কুপন তৈরি করে শুরু করুন"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">কুপন কোড</th>
                  <th className="py-3.5 px-4">ছাড়ের ধরণ ও মান</th>
                  <th className="py-3.5 px-4">ব্যবহারের সীমা</th>
                  <th className="py-3.5 px-4">মেয়াদ (Expiry)</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCoupons.map((coupon) => {
                  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                  return (
                    <tr key={coupon._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">
                            {coupon.code}
                          </span>
                        </div>
                        {coupon.description && (
                          <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">
                            {coupon.description}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {coupon.discountType === "percentage" ? (
                            <>
                              <Percent className="w-4 h-4 text-emerald-600" />
                              <span>{coupon.discountValue}% ছাড়</span>
                              {coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0 && (
                                <span className="text-xs text-slate-400 font-normal">
                                  (সর্বোচ্চ ৳{coupon.maxDiscountAmount})
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <CircleDollarSign className="w-4 h-4 text-emerald-600" />
                              <span>৳{coupon.discountValue} ফ্ল্যাট ছাড়</span>
                            </>
                          )}
                        </div>
                        {coupon.minOrderAmount && coupon.minOrderAmount > 0 ? (
                          <p className="text-xs text-slate-400 mt-0.5">
                            ন্যূনতম অর্ডার: ৳{coupon.minOrderAmount}
                          </p>
                        ) : null}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>
                            {coupon.usedCount} / {coupon.maxUses ? coupon.maxUses : "অসীম"}
                          </span>
                        </div>
                        {coupon.maxUses && coupon.usedCount >= coupon.maxUses && (
                          <span className="inline-block text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-1">
                            লিমিট শেষ
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {coupon.expiryDate ? (
                          <div>
                            <div className="flex items-center gap-1 text-slate-700 font-medium text-xs sm:text-sm">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(coupon.expiryDate).toLocaleDateString("bn-BD", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            {isExpired && (
                              <span className="inline-block text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded mt-1">
                                মেয়াদ উত্তীর্ণ
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">লাইফটাইম (মেয়াদ নেই)</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                            coupon.isActive
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          } disabled:opacity-50`}
                        >
                          {coupon.isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> একটিভ
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-slate-400" /> নিষ্ক্রিয়
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(coupon)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id, coupon.code)}
                            disabled={isDeleting}
                            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                {editingCoupon ? "কুপন এডিট করুন" : "নতুন কুপন কোড তৈরি করুন"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  কুপন কোড (Code) *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: SAVE20, EID2026"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  বিবরণ / ক্যাম্পেইন নাম
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ঈদুল ফিতর স্পেশাল ডিসকাউন্ট"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    ছাড়ের ধরণ *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as "fixed" | "percentage",
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  >
                    <option value="fixed">টাকা (Fixed ৳)</option>
                    <option value="percentage">শতাংশ (Percentage %)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    ছাড়ের পরিমাণ ({formData.discountType === "percentage" ? "%" : "৳"}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Max Discount for Percentage */}
              {formData.discountType === "percentage" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    সর্বোচ্চ ছাড়ের সীমা (Max Discount ৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="খালি রাখলে সীমাহীন"
                    value={formData.maxDiscountAmount || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Minimum Order Amount & Max Uses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    ন্যূনতম অর্ডার (Min Order ৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, minOrderAmount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    সর্বোচ্চ কতবার ব্যবহার (Max Uses)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="খালি রাখলে সীমাহীন"
                    value={formData.maxUses || ""}
                    onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  মেয়াদ শেষ হওয়ার তারিখ (Expiry Date)
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  নির্দিষ্ট তারিখ সেট না করলে কুপনটির কোনো এক্সপায়ারি থাকবে না।
                </p>
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActiveToggle" className="text-sm font-semibold text-slate-700">
                  কুপনটি এখন থেকেই সক্রিয় (Active) থাকবে
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {saving ? "সংরক্ষণ হচ্ছে..." : editingCoupon ? "আপডেট করুন" : "তৈরি করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
