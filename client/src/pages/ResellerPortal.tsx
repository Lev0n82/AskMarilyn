import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";
import { Building2, Users, Palette, Globe, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ResellerPortal() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", primaryColor: "#6366f1", secondaryColor: "#8b5cf6", customDomain: "" });

  const { data: tenants = [], refetch } = trpc.tenant.listAll.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const createTenant = trpc.tenant.create.useMutation({
    onSuccess: () => {
      toast.success("Tenant created successfully");
      setShowCreateForm(false);
      setForm({ name: "", slug: "", primaryColor: "#6366f1", secondaryColor: "#8b5cf6", customDomain: "" });
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user) { setLocation("/login"); return null; }
  if (user.role !== "reseller" && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="py-8 text-center">
            <p className="text-slate-500">Access denied. Reseller or admin role required.</p>
            <Button onClick={() => setLocation("/dashboard")} className="mt-4">Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => setLocation("/dashboard")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Reseller Portal
            </h1>
            <p className="text-slate-500 mt-1">Manage white-label tenants and branding configurations.</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Cancel" : "Create Tenant"}
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-base">New Tenant</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); createTenant.mutate(form); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Brand Name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Corp" required />
                  </div>
                  <div>
                    <Label>Slug (URL identifier)</Label>
                    <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder="acme-corp" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="w-8 h-8 rounded border" />
                      <Input value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="w-8 h-8 rounded border" />
                      <Input value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="flex-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Custom Domain (optional)</Label>
                  <Input value={form.customDomain} onChange={(e) => setForm({ ...form, customDomain: e.target.value })} placeholder="chat.acmecorp.com" />
                </div>
                <Button type="submit" disabled={createTenant.isPending}>
                  {createTenant.isPending ? "Creating..." : "Create Tenant"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tenant List */}
        <div className="grid gap-4">
          {tenants.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No tenants created yet. Create your first white-label tenant.</p>
              </CardContent>
            </Card>
          ) : (
            tenants.map((t: any) => (
              <Card key={t.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.primaryColor + "20" }}>
                        <Building2 className="w-5 h-5" style={{ color: t.primaryColor }} />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800">{t.name}</h3>
                        <p className="text-xs text-slate-500">/{t.slug} {t.customDomain && `• ${t.customDomain}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: t.primaryColor }} title="Primary" />
                        <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: t.secondaryColor }} title="Secondary" />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Tenant management coming soon")}>
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
