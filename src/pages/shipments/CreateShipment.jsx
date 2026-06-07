import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiArrowLeft } from "react-icons/hi";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import * as api from "../../api/shipmentApi";

export default function CreateShipment() {
  const navigate = useNavigate();
  const { getToken } = useUser();
  const token = getToken();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    carrier: "",
    shipping_method: "",
    estimated_delivery: "",
    weight: "",
    dimensions: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };
      await api.createShipment(token, data);
      toast.success("Shipment created successfully!");
      navigate("/dashboard/shipments");
    } catch (error) {
      toast.error(error.message || "Failed to create shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/shipments")}>
          <HiArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary">Create Shipment</h1>
          <p className="text-muted-foreground mt-1">Add a new shipment to track</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Origin *</label>
                <Input
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="Enter origin location"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Destination *</label>
                <Input
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Enter destination location"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Carrier</label>
                <Input
                  name="carrier"
                  value={formData.carrier}
                  onChange={handleChange}
                  placeholder="e.g., DHL, FedEx, UPS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Shipping Method</label>
                <Select name="shipping_method" value={formData.shipping_method} onChange={handleChange}>
                  <option value="">Select method</option>
                  <option value="air">Air Freight</option>
                  <option value="sea">Sea Freight</option>
                  <option value="land">Land Transport</option>
                  <option value="rail">Rail Transport</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Delivery</label>
                <Input
                  type="date"
                  name="estimated_delivery"
                  value={formData.estimated_delivery}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <Input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Dimensions</label>
                <Input
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="L x W x H (cm)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter shipment description..."
                  className="w-full h-32 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/shipments")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Shipment
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
