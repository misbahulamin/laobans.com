import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  HiPlus,
  HiTrash,
  HiDownload,
  HiCog,
  HiDocumentText,
  HiShoppingBag,
  HiCamera,
  HiRefresh,
} from "react-icons/hi";
import { Button } from "./ui/button";
import "./ProductInvoiceGenerator.css";

const CURRENCIES = [
  { code: "RMB", symbol: "¥", name: "Chinese Yuan" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];

const STORAGE_KEYS = {
  products: "productInvoice_products",
  settings: "productInvoice_settings",
};

const defaultSettings = {
  baseCurrency: "RMB",
  exchangeRates: { RMB: 1, BDT: 18.5, USD: 7.2 },
  companyName: "ShipSource Shop",
  weightShippingRate: 150,
};

export default function ProductInvoiceGenerator() {
  const [activeTab, setActiveTab] = useState("invoice");
  const [products, setProducts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [settings, setSettings] = useState(defaultSettings);
  const [editingRates, setEditingRates] = useState(false);

  const [formData, setFormData] = useState({
    skuId: "",
    productName: "",
    price: "",
    shippingFee: "",
    quantity: 1,
    colorName: "",
    size: "",
    availableColors: "",
    sizes: "",
    productWeight: "",
    productLink: "",
  });

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.products);
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch (e) {}

    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.settings);
      if (savedSettings) setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    } catch (e) {}
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(newSettings));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const currency = CURRENCIES.find((c) => c.code === settings.baseCurrency);
    
    const newProduct = {
      id: Date.now(),
      no: products.length + 1,
      skuId: formData.skuId || `SKU-${Date.now()}`,
      productName: formData.productName || formData.skuId || "Unnamed Product",
      price: parseFloat(formData.price) || 0,
      shippingFee: parseFloat(formData.shippingFee) || 0,
      quantity: parseInt(formData.quantity) || 1,
      colorName: formData.colorName || "",
      size: formData.size || "",
      availableColors: formData.availableColors || formData.colorName || "",
      sizes: formData.sizes || formData.size || "",
      productWeight: parseFloat(formData.productWeight) || 0,
      productLink: formData.productLink || "",
      productImage: imagePreview || null,
      currency: currency.code,
    };

    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(updated));

    setFormData({
      skuId: "",
      productName: "",
      price: "",
      shippingFee: "",
      quantity: 1,
      colorName: "",
      size: "",
      availableColors: "",
      sizes: "",
      productWeight: "",
      productLink: "",
    });
    setImagePreview(null);
  };

  const handleRemoveProduct = (id) => {
    const updated = products
      .filter((p) => p.id !== id)
      .map((p, idx) => ({ ...p, no: idx + 1 }));
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm("Clear all products?")) {
      setProducts([]);
      localStorage.removeItem(STORAGE_KEYS.products);
    }
  };

  const convertCurrency = (amount, from, to) => {
    if (from === to) return amount;
    const fromRate = settings.exchangeRates[from] || 1;
    const toRate = settings.exchangeRates[to] || 1;
    return (amount / fromRate) * toRate;
  };

  const formatCurrency = (amount, currencyCode) => {
    const curr = CURRENCIES.find((c) => c.code === currencyCode);
    return `${curr?.symbol || ""}${amount.toFixed(2)}`;
  };

  const getTotals = () => {
    let totalPrice = 0;
    let totalShipping = 0;

    products.forEach((p) => {
      totalPrice += (p.price || 0) * (p.quantity || 1);
      totalShipping += (p.shippingFee || 0) * (p.quantity || 1);
    });

    return {
      totalPrice,
      totalShipping,
      total: totalPrice + totalShipping,
    };
  };

  const totals = getTotals();

  const generateInvoicePDF = async (currencyCode) => {
    if (products.length === 0) return alert("Add at least one product.");

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const currency = CURRENCIES.find((c) => c.code === currencyCode);
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Colors
    const primaryColor = [15, 23, 42];
    const accentColor = [245, 158, 11];
    const lightBg = [248, 250, 252];
    const textDark = [30, 41, 59];
    const textMuted = [100, 116, 139];
    const white = [255, 255, 255];
    const borderColor = [226, 232, 240];

    // Header Background
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, "F");

    // Accent line under header
    doc.setFillColor(...accentColor);
    doc.rect(0, 35, pageWidth, 2, "F");

    // Company Name in Header
    doc.setTextColor(...white);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(settings.companyName, margin, 18);

    // Invoice type
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`${currency?.name || currencyCode} INVOICE`, pageWidth / 2, 18, { align: "center" });

    // Invoice details on right
    doc.setFontSize(9);
    doc.text(`Date: ${today}`, pageWidth - margin, 14, { align: "right" });
    doc.text(`Invoice #: INV-${Date.now().toString().slice(-6)}`, pageWidth - margin, 20, { align: "right" });
    doc.text(`Currency: ${currency?.symbol} ${currencyCode}`, pageWidth - margin, 26, { align: "right" });

    // Exchange rate info if not base currency
    let infoY = 45;
    if (currencyCode !== settings.baseCurrency) {
      const rate = settings.exchangeRates[currencyCode]?.toFixed(4);
      doc.setFillColor(...lightBg);
      doc.roundedRect(margin, infoY, pageWidth - margin * 2, 8, 2, 2, "F");
      doc.setFontSize(8);
      doc.setTextColor(...textMuted);
      doc.text(`Exchange Rate: 1 ${settings.baseCurrency} = ${rate} ${currencyCode}`, pageWidth / 2, infoY + 5.5, { align: "center" });
      infoY += 12;
    }

    // Products with images - Custom layout
    let currentY = infoY + 5;
    const colWidths = {
      no: 12,
      image: 22,
      sku: 30,
      product: 50,
      price: 28,
      shipping: 28,
      qty: 18,
      color: 30,
      size: 28,
      total: 32
    };
    const tableWidth = pageWidth - margin * 2;
    const startX = margin;

    // Table Header
    doc.setFillColor(...primaryColor);
    doc.rect(startX, currentY, tableWidth, 10, "F");

    let headerX = startX + 2;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...white);

    const headers = [
      { label: "#", width: colWidths.no },
      { label: "IMG", width: colWidths.image },
      { label: "SKU", width: colWidths.sku },
      { label: "PRODUCT", width: colWidths.product },
      { label: `PRICE (${currencyCode})`, width: colWidths.price },
      { label: `SHIP (${currencyCode})`, width: colWidths.shipping },
      { label: "QTY", width: colWidths.qty },
      { label: "COLOR", width: colWidths.color },
      { label: "SIZE", width: colWidths.size },
      { label: `TOTAL (${currencyCode})`, width: colWidths.total },
    ];

    headers.forEach((h) => {
      doc.text(h.label, headerX + h.width / 2, currentY + 7, { align: "center" });
      headerX += h.width;
    });

    currentY += 10;

    // Table Body
    const rowHeight = 18;
    products.forEach((p, index) => {
      const price = convertCurrency(p.price || 0, settings.baseCurrency, currencyCode);
      const shipping = convertCurrency(p.shippingFee || 0, settings.baseCurrency, currencyCode);
      const total = (price + shipping) * (p.quantity || 1);

      // Alternate row background
      if (index % 2 === 1) {
        doc.setFillColor(...lightBg);
        doc.rect(startX, currentY, tableWidth, rowHeight, "F");
      }

      // Row border
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.1);
      doc.line(startX, currentY, startX + tableWidth, currentY);
      doc.line(startX, currentY + rowHeight, startX + tableWidth, currentY + rowHeight);

      let cellX = startX + 2;

      // No.
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textMuted);
      doc.text(String(p.no), cellX + colWidths.no / 2, currentY + 12, { align: "center" });
      cellX += colWidths.no;

      // Image placeholder or image
      if (p.productImage) {
        try {
          doc.addImage(p.productImage, "JPEG", cellX + 1, currentY + 2, 18, 14, undefined, "FAST");
        } catch (e) {
          doc.setFillColor(...lightBg);
          doc.rect(cellX + 1, currentY + 2, 18, 14, "F");
          doc.setTextColor(...textMuted);
          doc.setFontSize(6);
          doc.text("IMG", cellX + 10, currentY + 10, { align: "center" });
        }
      } else {
        doc.setFillColor(...lightBg);
        doc.rect(cellX + 1, currentY + 2, 18, 14, "F");
        doc.setTextColor(...textMuted);
        doc.setFontSize(6);
        doc.text("NO IMG", cellX + 10, currentY + 10, { align: "center" });
      }
      cellX += colWidths.image;

      // SKU
      doc.setFontSize(7);
      doc.setTextColor(...accentColor);
      doc.text(p.skuId || "-", cellX + colWidths.sku / 2, currentY + 12, { align: "center" });
      cellX += colWidths.sku;

      // Product Name
      doc.setFontSize(8);
      doc.setTextColor(...textDark);
      doc.setFont("helvetica", "bold");
      const productName = p.productName.length > 25 ? p.productName.substring(0, 22) + "..." : p.productName;
      doc.text(productName, cellX + 2, currentY + 12);
      cellX += colWidths.product;

      // Price
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textDark);
      doc.text(`${currency?.symbol}${price.toFixed(2)}`, cellX + colWidths.price / 2, currentY + 12, { align: "center" });
      cellX += colWidths.price;

      // Shipping
      doc.text(`${currency?.symbol}${shipping.toFixed(2)}`, cellX + colWidths.shipping / 2, currentY + 12, { align: "center" });
      cellX += colWidths.shipping;

      // Quantity
      doc.text(String(p.quantity || 1), cellX + colWidths.qty / 2, currentY + 12, { align: "center" });
      cellX += colWidths.qty;

      // Color
      doc.text(p.colorName || "-", cellX + colWidths.color / 2, currentY + 12, { align: "center" });
      cellX += colWidths.color;

      // Size
      doc.text(p.size || "-", cellX + colWidths.size / 2, currentY + 12, { align: "center" });
      cellX += colWidths.size;

      // Total
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...textDark);
      doc.text(`${currency?.symbol}${total.toFixed(2)}`, cellX + colWidths.total / 2, currentY + 12, { align: "center" });

      currentY += rowHeight;
    });

    // Bottom border
    doc.line(startX, currentY, startX + tableWidth, currentY);

    // Summary Section
    currentY += 10;
    const summaryWidth = 90;
    const summaryX = pageWidth - margin - summaryWidth;

    // Summary box
    doc.setFillColor(...lightBg);
    doc.roundedRect(summaryX, currentY, summaryWidth, 35, 3, 3, "F");

    const subtotalConverted = convertCurrency(totals.totalPrice, settings.baseCurrency, currencyCode);
    const shippingConverted = convertCurrency(totals.totalShipping, settings.baseCurrency, currencyCode);
    const totalConverted = convertCurrency(totals.total, settings.baseCurrency, currencyCode);

    let summaryY = currentY + 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textMuted);
    doc.text("Subtotal:", summaryX + 5, summaryY);
    doc.setTextColor(...textDark);
    doc.setFont("helvetica", "bold");
    doc.text(`${currency?.symbol}${subtotalConverted.toFixed(2)}`, summaryX + summaryWidth - 5, summaryY, { align: "right" });

    summaryY += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textMuted);
    doc.text("Shipping:", summaryX + 5, summaryY);
    doc.setTextColor(...textDark);
    doc.setFont("helvetica", "bold");
    doc.text(`${currency?.symbol}${shippingConverted.toFixed(2)}`, summaryX + summaryWidth - 5, summaryY, { align: "right" });

    // Total row with highlight
    summaryY += 10;
    doc.setFillColor(...accentColor);
    doc.roundedRect(summaryX + 3, summaryY - 4, summaryWidth - 6, 10, 2, 2, "F");
    doc.setTextColor(...white);
    doc.setFontSize(10);
    doc.text("TOTAL:", summaryX + 8, summaryY + 2);
    doc.text(`${currency?.symbol}${totalConverted.toFixed(2)}`, summaryX + summaryWidth - 8, summaryY + 2, { align: "right" });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text(`Generated on ${today} | ${settings.companyName}`, pageWidth / 2, pageHeight - 8, { align: "center" });

    doc.save(`Invoice_${currencyCode}_${today.replace(/\//g, "-")}.pdf`);
  };

  const generateProductPDF = async (currencyCode) => {
    if (products.length === 0) return alert("Add at least one product.");

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const currency = CURRENCIES.find((c) => c.code === currencyCode);
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Colors
    const primaryColor = [15, 23, 42];
    const accentColor = [245, 158, 11];
    const lightBg = [248, 250, 252];
    const textDark = [30, 41, 59];
    const textMuted = [100, 116, 139];
    const white = [255, 255, 255];
    const cardBg = [255, 255, 255];

    // Header function for subsequent pages
    const addPageHeader = () => {
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 22, "F");
      doc.setFillColor(...accentColor);
      doc.rect(0, 20, pageWidth, 2, "F");
      doc.setTextColor(...white);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(settings.companyName, margin, 13);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Product Catalog", pageWidth / 2, 13, { align: "center" });
      doc.text(`${currency?.symbol} ${currencyCode}`, pageWidth - margin, 13, { align: "right" });
      doc.setTextColor(...textDark);
    };

    // First page header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setFillColor(...accentColor);
    doc.rect(0, 38, pageWidth, 2, "F");

    // Company logo placeholder
    doc.setFillColor(...accentColor);
    doc.roundedRect(margin, 10, 30, 20, 3, 3, "F");
    doc.setTextColor(...white);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SS", margin + 15, 23, { align: "center" });

    // Title
    doc.setTextColor(...white);
    doc.setFontSize(20);
    doc.text("PRODUCT CATALOG", margin + 38, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${settings.companyName} | ${today}`, margin + 38, 30);

    // Currency badge
    doc.setFillColor(...accentColor);
    doc.roundedRect(pageWidth - margin - 30, 12, 30, 12, 3, 3, "F");
    doc.setTextColor(...white);
    doc.setFontSize(9);
    doc.text(`${currency?.symbol} ${currencyCode}`, pageWidth - margin - 15, 20, { align: "center" });

    let currentY = 50;

    // Products as cards
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const price = convertCurrency(p.price || 0, settings.baseCurrency, currencyCode);
      const cardHeight = 55;

      // Check if we need a new page
      if (currentY + cardHeight > pageHeight - margin) {
        doc.addPage();
        addPageHeader();
        currentY = 35;
      }

      // Card background
      doc.setFillColor(...cardBg);
      doc.setDrawColor(...[226, 232, 240]);
      doc.roundedRect(margin, currentY, pageWidth - margin * 2, cardHeight, 3, 3, "FD");

      // Image section (left side)
      const imgX = margin + 5;
      const imgY = currentY + 5;
      const imgSize = 45;

      if (p.productImage) {
        try {
          doc.addImage(p.productImage, "JPEG", imgX, imgY, imgSize, imgSize, undefined, "FAST");
          // Image border
          doc.setDrawColor(...[226, 232, 240]);
          doc.setLineWidth(0.3);
          doc.rect(imgX, imgY, imgSize, imgSize);
        } catch (e) {
          // Image placeholder
          doc.setFillColor(...lightBg);
          doc.rect(imgX, imgY, imgSize, imgSize, "F");
          doc.setTextColor(...textMuted);
          doc.setFontSize(8);
          doc.text("No Image", imgX + imgSize / 2, imgY + imgSize / 2 + 2, { align: "center" });
        }
      } else {
        doc.setFillColor(...lightBg);
        doc.rect(imgX, imgY, imgSize, imgSize, "F");
        doc.setTextColor(...textMuted);
        doc.setFontSize(8);
        doc.text("No Image", imgX + imgSize / 2, imgY + imgSize / 2 + 2, { align: "center" });
      }

      // Product info section (right side)
      const infoX = imgX + imgSize + 10;

      // Product number badge
      doc.setFillColor(...primaryColor);
      doc.roundedRect(infoX, currentY + 5, 18, 10, 2, 2, "F");
      doc.setTextColor(...white);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`#${p.no}`, infoX + 9, currentY + 12, { align: "center" });

      // Product name
      doc.setTextColor(...textDark);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const productName = p.productName.length > 40 ? p.productName.substring(0, 37) + "..." : p.productName;
      doc.text(productName, infoX + 22, currentY + 12);

      // SKU
      if (p.skuId) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...textMuted);
        doc.text(`SKU: ${p.skuId}`, infoX, currentY + 20);
      }

      // Details row
      let detailY = currentY + 26;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");

      // Price - prominent
      doc.setFillColor(...accentColor);
      doc.roundedRect(infoX, detailY, 40, 12, 2, 2, "F");
      doc.setTextColor(...white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${currency?.symbol}${price.toFixed(2)}`, infoX + 20, detailY + 8, { align: "center" });

      // Other details inline
      const detailX = infoX + 48;
      doc.setFillColor(...lightBg);
      doc.setTextColor(...textDark);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");

      let detailCol = 0;
      const colWidth = 35;
      const details = [];

      if (p.availableColors) details.push(`Colors: ${p.availableColors}`);
      if (p.sizes) details.push(`Sizes: ${p.sizes}`);
      if (p.productWeight) details.push(`Weight: ${p.productWeight}kg`);

      details.forEach((detail, idx) => {
        const x = detailX + (idx * colWidth);
        if (x + colWidth < pageWidth - margin - 5) {
          doc.text(detail, x, detailY + 8);
        }
      });

      // Link (if exists)
      if (p.productLink) {
        doc.setTextColor(...[59, 130, 246]);
        doc.setFontSize(7);
        const linkText = p.productLink.length > 60 ? p.productLink.substring(0, 57) + "..." : p.productLink;
        doc.textWithLink(linkText, infoX, currentY + 42, {
          url: p.productLink,
          underline: true,
        });
      }

      currentY += cardHeight + 8;
    }

    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text(`Generated by ${settings.companyName} | ${today}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save(`Product_Catalog_${currencyCode}_${today.replace(/\//g, "-")}.pdf`);
  };

  const handleCurrencyChange = (code) => {
    saveSettings({ ...settings, baseCurrency: code });
  };

  const handleRateChange = (currency, value) => {
    const newRates = { ...settings.exchangeRates, [currency]: parseFloat(value) || 0 };
    saveSettings({ ...settings, exchangeRates: newRates });
  };

  return (
    <div className="invoice-generator">
      <div className="invoice-generator-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="invoice-header">
            <div>
              <h1 className="invoice-title">Product & Invoice Generator</h1>
              <p className="invoice-subtitle">Generate invoices and catalogs in any currency</p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`settings-toggle ${showSettings ? "active" : ""}`}
            >
              <HiCog className="w-5 h-5" />
            </button>
          </div>

          {/* Currency Selector */}
          <div className="currency-selector">
            <div className="currency-tabs">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencyChange(curr.code)}
                  className={`currency-tab ${settings.baseCurrency === curr.code ? "active" : ""}`}
                >
                  <span className="currency-symbol">{curr.symbol}</span>
                  <span className="currency-code">{curr.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs">
              <button
                onClick={() => setActiveTab("invoice")}
                className={`tab-button ${activeTab === "invoice" ? "active" : ""}`}
              >
                <HiDocumentText className="w-5 h-5" />
                Invoice Generator
              </button>
              <button
                onClick={() => setActiveTab("product")}
                className={`tab-button ${activeTab === "product" ? "active" : ""}`}
              >
                <HiShoppingBag className="w-5 h-5" />
                Product Catalog
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="settings-panel"
            >
              <div className="settings-row">
                <div className="settings-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => saveSettings({ ...settings, companyName: e.target.value })}
                    placeholder="Your Company"
                  />
                </div>
                <div className="settings-group">
                  <label>Weight Shipping Rate (BDT/kg)</label>
                  <input
                    type="number"
                    value={settings.weightShippingRate}
                    onChange={(e) => saveSettings({ ...settings, weightShippingRate: parseFloat(e.target.value) || 0 })}
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="exchange-rates">
                <div className="exchange-rates-header">
                  <h4>Exchange Rates (Base: {settings.baseCurrency})</h4>
                  <button
                    onClick={() => setEditingRates(!editingRates)}
                    className="edit-rates-btn"
                  >
                    <HiRefresh className="w-4 h-4" />
                    {editingRates ? "Done" : "Edit"}
                  </button>
                </div>
                <div className="rates-grid">
                  {CURRENCIES.map((curr) => (
                    <div key={curr.code} className="rate-item">
                      <span className="rate-label">
                        1 {settings.baseCurrency} = {curr.symbol}
                      </span>
                      {editingRates ? (
                        <input
                          type="number"
                          step="0.0001"
                          value={settings.exchangeRates[curr.code]}
                          onChange={(e) => handleRateChange(curr.code, e.target.value)}
                        />
                      ) : (
                        <span className="rate-value">{settings.exchangeRates[curr.code]?.toFixed(4)}</span>
                      )}
                      <span className="rate-currency">{curr.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <div className="form-section">
            <h3 className="section-title">
              <HiPlus className="w-5 h-5" />
              Add Product
            </h3>
            <form onSubmit={handleAddProduct} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>{activeTab === "invoice" ? "SKU ID" : "Product Name"} *</label>
                  <input
                    type="text"
                    name={activeTab === "invoice" ? "skuId" : "productName"}
                    value={activeTab === "invoice" ? formData.skuId : formData.productName}
                    onChange={handleInputChange}
                    placeholder={activeTab === "invoice" ? "SKU-001" : "Product Title"}
                  />
                </div>
                <div className="form-group">
                  <label>Price ({settings.baseCurrency}) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {activeTab === "invoice" && (
                  <div className="form-group">
                    <label>Shipping ({settings.baseCurrency})</label>
                    <input
                      type="number"
                      name="shippingFee"
                      value={formData.shippingFee}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    name="colorName"
                    value={formData.colorName}
                    onChange={handleInputChange}
                    placeholder="Red, Blue"
                  />
                </div>
                <div className="form-group">
                  <label>Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="M, L, XL"
                  />
                </div>
                {activeTab === "product" && (
                  <>
                    <div className="form-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number"
                        name="productWeight"
                        value={formData.productWeight}
                        onChange={handleInputChange}
                        placeholder="0.5"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Product Link</label>
                      <input
                        type="url"
                        name="productLink"
                        value={formData.productLink}
                        onChange={handleInputChange}
                        placeholder="https://example.com/product"
                      />
                    </div>
                  </>
                )}
                <div className="form-group image-upload-group">
                  <label>Product Image</label>
                  <div className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="image-upload-label">
                      <HiCamera className="w-8 h-8" />
                      <span>Click to upload</span>
                    </label>
                    {imagePreview && (
                      <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                        <button type="button" onClick={() => setImagePreview(null)} className="remove-image">
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <Button type="submit" className="add-product-btn">
                  <HiPlus className="w-5 h-5" />
                  Add Product
                </Button>
              </div>
            </form>
          </div>

          {/* Products */}
          <div className="products-section">
            <div className="products-header">
              <h3 className="section-title">
                <HiShoppingBag className="w-5 h-5" />
                Products ({products.length})
              </h3>
              {products.length > 0 && (
                <button onClick={handleClearAll} className="clear-all-btn">
                  <HiTrash className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <div className="empty-state">
                <HiShoppingBag className="w-16 h-16" />
                <h4>No products added</h4>
                <p>Add products using the form above</p>
              </div>
            ) : (
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th className="th-image">Image</th>
                      <th>{activeTab === "invoice" ? "SKU" : "Product"}</th>
                      <th>Price</th>
                      {activeTab === "invoice" && <th>Ship</th>}
                      <th>Qty</th>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Total</th>
                      <th className="th-actions"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.no}</td>
                        <td className="td-image">
                          {p.productImage ? (
                            <img src={p.productImage} alt="" />
                          ) : (
                            <div className="image-placeholder"><HiShoppingBag /></div>
                          )}
                        </td>
                        <td className="td-name">{activeTab === "invoice" ? p.skuId : p.productName}</td>
                        <td>{formatCurrency(p.price || 0, settings.baseCurrency)}</td>
                        {activeTab === "invoice" && <td>{formatCurrency(p.shippingFee || 0, settings.baseCurrency)}</td>}
                        <td>{p.quantity}</td>
                        <td>{p.colorName || "-"}</td>
                        <td>{p.size || "-"}</td>
                        <td className="td-total">
                          {formatCurrency(((p.price + p.shippingFee) * p.quantity), settings.baseCurrency)}
                        </td>
                        <td className="td-actions">
                          <button onClick={() => handleRemoveProduct(p.id)} className="remove-btn">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {products.length > 0 && (
              <div className="totals-section">
                <div className="totals-grid">
                  <div className="total-item">
                    <span>Subtotal</span>
                    <strong>{formatCurrency(totals.totalPrice, settings.baseCurrency)}</strong>
                  </div>
                  <div className="total-item">
                    <span>Shipping</span>
                    <strong>{formatCurrency(totals.totalShipping, settings.baseCurrency)}</strong>
                  </div>
                  <div className="total-item highlight">
                    <span>Total ({settings.baseCurrency})</span>
                    <strong>{formatCurrency(totals.total, settings.baseCurrency)}</strong>
                  </div>
                </div>

                <div className="currency-conversions">
                  {CURRENCIES.filter((c) => c.code !== settings.baseCurrency).map((curr) => (
                    <div key={curr.code} className="conversion-item">
                      <span>{curr.name}</span>
                      <strong>{formatCurrency(convertCurrency(totals.total, settings.baseCurrency, curr.code), curr.code)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generate Buttons */}
          <div className="actions-section">
            <div className="generate-group">
              <span className="generate-label">Generate Invoice</span>
              <div className="generate-buttons">
                {CURRENCIES.map((curr) => (
                  <Button
                    key={curr.code}
                    onClick={() => generateInvoicePDF(curr.code)}
                    disabled={products.length === 0}
                    className="generate-btn"
                  >
                    <HiDownload className="w-4 h-4" />
                    {curr.code}
                  </Button>
                ))}
              </div>
            </div>
            <div className="generate-group">
              <span className="generate-label">Generate Catalog</span>
              <div className="generate-buttons">
                {CURRENCIES.map((curr) => (
                  <Button
                    key={curr.code}
                    onClick={() => generateProductPDF(curr.code)}
                    disabled={products.length === 0}
                    className="generate-btn catalog-btn"
                  >
                    <HiDownload className="w-4 h-4" />
                    {curr.code}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
