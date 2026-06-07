import { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HiCalculator, HiPlus, HiTrash, HiDownload, HiCamera } from 'react-icons/hi';
import { Button } from '../components/ui/button';
import './InvoiceCalculator.css';

const InvoiceCalculator = () => {
  const loadFromStorage = () => {
    try {
      const savedItems = localStorage.getItem('invoiceCalculator_items');
      const savedRmbRate = localStorage.getItem('invoiceCalculator_rmbRate');
      const savedCompanyName = localStorage.getItem('invoiceCalculator_companyName');
      
      if (savedItems) {
        return {
          items: JSON.parse(savedItems),
          rmbRate: savedRmbRate || '',
          companyName: savedCompanyName || 'Rubayed International Co. Ltd'
        };
      }
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }
    return {
      items: [],
      rmbRate: '',
      companyName: 'Rubayed International Co. Ltd'
    };
  };

  const loadColumnVisibility = () => {
    try {
      const saved = localStorage.getItem('invoiceCalculator_columnVisibility');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Error loading column visibility:', error);
    }
    return {
      no: true,
      image: true,
      skuId: true,
      buyingPrice: true,
      shippingFee: true,
      quantity: true,
      color: true,
      size: true,
      totalPrice: true
    };
  };

  const [items, setItems] = useState(loadFromStorage().items);
  const [rmbRate, setRmbRate] = useState(loadFromStorage().rmbRate);
  const [companyName, setCompanyName] = useState(loadFromStorage().companyName);
  const [columnVisibility, setColumnVisibility] = useState(loadColumnVisibility());
  const [formData, setFormData] = useState({
    skuId: '',
    buyingPrice: '',
    shippingFee: '',
    quantity: '',
    colorName: '',
    size: '',
    skuImage: null,
    imagePreview: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'skuImage' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          skuImage: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    
    if (!formData.skuId || !formData.buyingPrice || !formData.quantity) {
      alert('Please fill in required fields: SKU ID, Buying Price, and Quantity');
      return;
    }

    const buyingPrice = parseFloat(formData.buyingPrice) || 0;
    const shippingFee = parseFloat(formData.shippingFee) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    const totalPrice = (buyingPrice + shippingFee) * quantity;

    const newItem = {
      id: Date.now(),
      no: items.length + 1,
      skuId: formData.skuId,
      buyingPrice: buyingPrice,
      shippingFee: shippingFee,
      quantity: quantity,
      colorName: formData.colorName || 'N/A',
      size: formData.size || 'N/A',
      totalPrice: totalPrice,
      skuImage: formData.imagePreview,
      imageFile: formData.skuImage
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    
    try {
      localStorage.setItem('invoiceCalculator_items', JSON.stringify(updatedItems));
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
    
    setFormData({
      skuId: '',
      buyingPrice: '',
      shippingFee: '',
      quantity: '',
      colorName: '',
      size: '',
      skuImage: null,
      imagePreview: null
    });
    
    const fileInput = document.getElementById('skuImage');
    if (fileInput) fileInput.value = '';
  };

  const handleRemoveItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    const renumberedItems = updatedItems.map((item, index) => ({
      ...item,
      no: index + 1
    }));
    setItems(renumberedItems);
    
    try {
      localStorage.setItem('invoiceCalculator_items', JSON.stringify(renumberedItems));
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  };

  const calculateTotals = () => {
    const totalBuyingPrice = items.reduce((sum, item) => sum + (item.buyingPrice * item.quantity), 0);
    const totalShippingCost = items.reduce((sum, item) => sum + (item.shippingFee * item.quantity), 0);
    const totalCalculatedPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalCost = totalBuyingPrice + totalShippingCost;
    
    return {
      totalBuyingPrice,
      totalShippingCost,
      totalCalculatedPrice,
      totalCost
    };
  };

  const generatePDF = async () => {
    try {
      if (items.length === 0) {
        alert('Please add at least one item before generating PDF');
        return;
      }

      if (!rmbRate || parseFloat(rmbRate) <= 0) {
        alert('Please enter a valid RMB rate');
        return;
      }

      const doc = new jsPDF();
      
      if (typeof autoTable === 'undefined' && typeof doc.autoTable === 'undefined') {
        alert('PDF table plugin not loaded. Please refresh the page and try again.');
        return;
      }

      const totals = calculateTotals();
      const rate = parseFloat(rmbRate);
      const totalInBDT = totals.totalCost * rate;

      const imagePromises = items.map((item, itemIndex) => {
        return new Promise((resolve) => {
          if (item.skuImage) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve({ index: itemIndex, img, dataUrl: item.skuImage });
            img.onerror = () => resolve({ index: itemIndex, img: null, dataUrl: null });
            img.src = item.skuImage;
          } else {
            resolve({ index: itemIndex, img: null, dataUrl: null });
          }
        });
      });

      const loadedImages = await Promise.all(imagePromises);
      const imageMap = {};
      loadedImages.forEach(({ index, img, dataUrl }) => {
        if (img && dataUrl) {
          imageMap[index] = { img, dataUrl };
        }
      });

      let logoDataUrl = null;
      try {
        const logoResponse = await fetch('/final logo.png');
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob();
          logoDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(logoBlob);
          });
        }
      } catch (logoError) {
        console.warn('Could not load logo:', logoError);
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header background
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // Accent line
      doc.setFillColor(245, 158, 11);
      doc.rect(0, 35, pageWidth, 2, 'F');
      
      if (logoDataUrl) {
        try {
          doc.addImage(logoDataUrl, 'PNG', pageWidth - 30, 5, 25, 25);
        } catch (logoErr) {
          console.warn('Error adding logo:', logoErr);
        }
      }
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(companyName || 'Shaz Online Shop', pageWidth / 2, 18, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Invoice Calculation', pageWidth / 2, 28, { align: 'center' });
      
      doc.setTextColor(0, 0, 0);
      
      const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 42, pageWidth - 28, 12, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(`Date: ${today}`, 18, 48);
      doc.text(`RMB Rate: ${rate.toFixed(2)}`, pageWidth - 18, 48, { align: 'right' });

      const columnOrder = [
        { key: 'no', label: 'No', visible: columnVisibility.no },
        { key: 'image', label: 'Image', visible: columnVisibility.image },
        { key: 'skuId', label: 'SKU ID', visible: columnVisibility.skuId },
        { key: 'buyingPrice', label: 'Buying Price (RMB)', visible: columnVisibility.buyingPrice },
        { key: 'shippingFee', label: 'Shipping Fee (RMB)', visible: columnVisibility.shippingFee },
        { key: 'quantity', label: 'Quantity', visible: columnVisibility.quantity },
        { key: 'color', label: 'Color', visible: columnVisibility.color },
        { key: 'size', label: 'Size', visible: columnVisibility.size },
        { key: 'totalPrice', label: 'Total Price (RMB)', visible: columnVisibility.totalPrice }
      ];

      const visibleColumns = columnOrder.filter(col => col.visible);
      const head = visibleColumns.map(col => col.label);
      
      const tableData = items.map((item) => {
        const row = [];
        if (columnVisibility.no) row.push(item.no.toString());
        if (columnVisibility.image) row.push('');
        if (columnVisibility.skuId) row.push(item.skuId);
        if (columnVisibility.buyingPrice) row.push(item.buyingPrice.toFixed(2));
        if (columnVisibility.shippingFee) row.push(item.shippingFee.toFixed(2));
        if (columnVisibility.quantity) row.push(item.quantity.toString());
        if (columnVisibility.color) row.push(item.colorName);
        if (columnVisibility.size) row.push(item.size);
        if (columnVisibility.totalPrice) row.push(item.totalPrice.toFixed(2));
        return row;
      });

      const tableOptions = {
        startY: 60,
        head: [head],
        body: tableData,
        showHead: 'everyPage',
        pageBreak: 'auto',
        margin: { top: 15, right: 14, bottom: 10, left: 14 },
        tableWidth: 'auto',
        useCss: false,
        rowPageBreak: 'avoid',
        styles: { 
          fontSize: 9,
          cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          valign: 'middle',
          minCellHeight: 16
        },
        headStyles: { 
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'center',
          cellPadding: { top: 3, right: 2, bottom: 3, left: 2 }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: (() => {
          const styles = {};
          let colIndex = 0;
          const widths = {
            no: 10,
            image: 18,
            skuId: 28,
            buyingPrice: 28,
            shippingFee: 25,
            quantity: 16,
            color: 20,
            size: 18,
            totalPrice: 28
          };
          const aligns = {
            no: 'center',
            image: 'center',
            skuId: 'left',
            buyingPrice: 'right',
            shippingFee: 'right',
            quantity: 'center',
            color: 'left',
            size: 'center',
            totalPrice: 'right'
          };
          
          columnOrder.forEach(col => {
            if (col.visible) {
              styles[colIndex] = {
                cellWidth: widths[col.key],
                halign: aligns[col.key],
                valign: 'middle'
              };
              colIndex++;
            }
          });
          return styles;
        })(),
        didDrawPage: (data) => {
          if (logoDataUrl && data.pageNumber > 1) {
            try {
              const pWidth = doc.internal.pageSize.getWidth();
              doc.addImage(logoDataUrl, 'PNG', pWidth - 30, 5, 25, 25);
            } catch (logoErr) {
              console.warn('Error adding logo to page:', logoErr);
            }
          }
        },
        didDrawCell: (data) => {
          const isHeaderRow = data.section === 'head' || data.row.index === undefined || data.row.index < 0;
          
          let imageColumnIndex = -1;
          let currentIndex = 0;
          columnOrder.forEach(col => {
            if (col.visible) {
              if (col.key === 'image') {
                imageColumnIndex = currentIndex;
              }
              currentIndex++;
            }
          });
          
          if (data.column.index === imageColumnIndex && imageColumnIndex >= 0 && !isHeaderRow && data.row.index >= 0) {
            const itemIndex = data.row.index;
            const imageData = imageMap[itemIndex];
            
            if (imageData && imageData.dataUrl) {
              try {
                const imgSize = 12;
                const x = data.cell.x + (data.cell.width / 2) - (imgSize / 2);
                const y = data.cell.y + (data.cell.height / 2) - (imgSize / 2);
                const format = imageData.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.1);
                doc.rect(x - 0.5, y - 0.5, imgSize + 1, imgSize + 1);
                
                doc.addImage(
                  imageData.dataUrl,
                  format,
                  x,
                  y,
                  imgSize,
                  imgSize,
                  undefined,
                  'FAST'
                );
              } catch (imgError) {
                doc.setFillColor(230, 230, 230);
                doc.rect(data.cell.x + 3, data.cell.y + 3, 10, 10, 'F');
                doc.setFontSize(5);
                doc.setTextColor(150, 150, 150);
                doc.text('N/A', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, { align: 'center', baseline: 'middle' });
              }
            } else {
              doc.setFillColor(240, 240, 240);
              doc.rect(data.cell.x + 3, data.cell.y + 3, 10, 10, 'F');
              doc.setDrawColor(200, 200, 200);
              doc.setLineWidth(0.1);
              doc.rect(data.cell.x + 3, data.cell.y + 3, 10, 10);
              doc.setFontSize(5);
              doc.setTextColor(150, 150, 150);
              doc.text('N/A', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, { align: 'center', baseline: 'middle' });
            }
          }
        }
      };

      if (typeof autoTable === 'function') {
        autoTable(doc, tableOptions);
      } else if (typeof doc.autoTable === 'function') {
        doc.autoTable(tableOptions);
      } else {
        throw new Error('autoTable is not available.');
      }

      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 5 : 100;
      
      const pageHeight = doc.internal.pageSize.getHeight();
      const summaryHeight = 50;
      
      if (finalY + summaryHeight > pageHeight - 15) {
        doc.addPage();
        finalY = 15;
      }
      
      let currentY = finalY + 10;
      
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, currentY - 5, pageWidth - 28, 35, 3, 3, 'F');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
      doc.text('Summary', 18, currentY);
      
      currentY += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      
      doc.text('Total Buying Price (RMB):', 20, currentY);
      doc.setFont('helvetica', 'bold');
      doc.text(`${totals.totalBuyingPrice.toFixed(2)}`, pageWidth - 20, currentY, { align: 'right' });
      currentY += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.text('Total Shipping Cost (RMB):', 20, currentY);
      doc.setFont('helvetica', 'bold');
      doc.text(`${totals.totalShippingCost.toFixed(2)}`, pageWidth - 20, currentY, { align: 'right' });
      currentY += 7;
      
      doc.setFont('helvetica', 'normal');
      doc.text('Total Cost (RMB):', 20, currentY);
      doc.setFont('helvetica', 'bold');
      doc.text(`${totals.totalCost.toFixed(2)}`, pageWidth - 20, currentY, { align: 'right' });
      currentY += 10;
      
      doc.setFillColor(245, 158, 11);
      doc.roundedRect(18, currentY - 5, pageWidth - 36, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total in BDT:', 22, currentY + 1);
      doc.text(`${totalInBDT.toFixed(2)} BDT`, pageWidth - 22, currentY + 1, { align: 'right' });

      const fileName = `Invoice_${today.replace(/\//g, '-')}.pdf`;
      doc.save(fileName);
      
      alert('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message}`);
    }
  };

  const totals = calculateTotals();
  const totalInBDT = rmbRate && parseFloat(rmbRate) > 0 
    ? totals.totalCost * parseFloat(rmbRate) 
    : 0;

  const updateColumnVisibility = (key, checked) => {
    const updated = { ...columnVisibility, [key]: checked };
    setColumnVisibility(updated);
    try {
      localStorage.setItem('invoiceCalculator_columnVisibility', JSON.stringify(updated));
    } catch (error) {
      console.warn('Error saving column visibility:', error);
    }
  };

  return (
    <div className="invoice-calculator">
      <div className="invoice-calculator-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Header */}
          <div className="invoice-header">
            <div>
              <h1 className="invoice-title">Invoice Calculator</h1>
              <p className="invoice-subtitle">Calculate and generate invoice PDFs with RMB to BDT conversion</p>
            </div>
          </div>

          <div className="invoice-main-content">
            {/* Form Section */}
            <div className="form-section">
              <h3 className="section-title">
                <HiPlus className="w-5 h-5" />
                Add Product Item
              </h3>
              <form onSubmit={handleAddItem} className="product-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="skuId">SKU ID *</label>
                    <input
                      type="text"
                      id="skuId"
                      name="skuId"
                      value={formData.skuId}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter SKU ID"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="buyingPrice">Buying Price (RMB) *</label>
                    <input
                      type="number"
                      id="buyingPrice"
                      name="buyingPrice"
                      value={formData.buyingPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shippingFee">Shipping Fee (RMB)</label>
                    <input
                      type="number"
                      id="shippingFee"
                      name="shippingFee"
                      value={formData.shippingFee}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity *</label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="1"
                      required
                      placeholder="1"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="colorName">Color Name</label>
                    <input
                      type="text"
                      id="colorName"
                      name="colorName"
                      value={formData.colorName}
                      onChange={handleInputChange}
                      placeholder="Enter color name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="size">Size</label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="Enter size"
                    />
                  </div>

                  <div className="form-group image-upload-group">
                    <label htmlFor="skuImage">SKU Image</label>
                    <div className="image-upload-area">
                      <input
                        type="file"
                        id="skuImage"
                        name="skuImage"
                        accept="image/*"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="skuImage" className="image-upload-label">
                        <HiCamera className="w-8 h-8" />
                        <span>Click to upload image</span>
                      </label>
                      {formData.imagePreview && (
                        <div className="image-preview-container">
                          <img src={formData.imagePreview} alt="Preview" className="image-preview" />
                          <button 
                            type="button" 
                            onClick={() => {
                              setFormData(prev => ({ ...prev, skuImage: null, imagePreview: null }));
                              const fileInput = document.getElementById('skuImage');
                              if (fileInput) fileInput.value = '';
                            }} 
                            className="remove-image"
                          >
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
                    Add Item
                  </Button>
                </div>
              </form>

              <div className="company-name-section">
                <label htmlFor="companyName">Company Name (for Invoice)</label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    try {
                      localStorage.setItem('invoiceCalculator_companyName', e.target.value);
                    } catch (error) {
                      console.warn('Error saving companyName:', error);
                    }
                  }}
                  placeholder="Enter company name"
                />
              </div>

              <div className="rmb-rate-section">
                <label htmlFor="rmbRate">Today's RMB Rate (BDT) *</label>
                <input
                  type="number"
                  id="rmbRate"
                  value={rmbRate}
                  onChange={(e) => setRmbRate(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="Enter RMB to BDT rate"
                  required
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="items-section">
              <div className="items-header">
                <h3 className="section-title">
                  <HiCalculator className="w-5 h-5" />
                  Items List ({items.length})
                </h3>
                {items.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm('Clear all items?')) {
                        setItems([]);
                        localStorage.removeItem('invoiceCalculator_items');
                      }
                    }} 
                    className="clear-all-btn"
                  >
                    <HiTrash className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
              
              {items.length === 0 ? (
                <div className="empty-state">
                  <HiCalculator className="w-16 h-16" />
                  <h4>No items added yet</h4>
                  <p>Add items using the form above</p>
                </div>
              ) : (
                <>
                  <div className="items-table-container">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Image</th>
                          <th>SKU ID</th>
                          <th>Buying Price</th>
                          <th>Shipping</th>
                          <th>Qty</th>
                          <th>Color</th>
                          <th>Size</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id}>
                            <td>{item.no}</td>
                            <td className="td-image">
                              {item.skuImage ? (
                                <img src={item.skuImage} alt={item.skuId} className="item-image" />
                              ) : (
                                <div className="image-placeholder">-</div>
                              )}
                            </td>
                            <td className="td-sku">{item.skuId}</td>
                            <td>{item.buyingPrice.toFixed(2)} ¥</td>
                            <td>{item.shippingFee.toFixed(2)} ¥</td>
                            <td>{item.quantity}</td>
                            <td>{item.colorName}</td>
                            <td>{item.size}</td>
                            <td className="td-total">{item.totalPrice.toFixed(2)} ¥</td>
                            <td>
                              <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="btn-remove"
                              >
                                <HiTrash className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Summary */}
                  <div className="totals-summary">
                    <h4>Summary</h4>
                    <div className="totals-grid">
                      <div className="total-item">
                        <span>Total Buying Price</span>
                        <strong>{totals.totalBuyingPrice.toFixed(2)} ¥</strong>
                      </div>
                      <div className="total-item">
                        <span>Total Shipping</span>
                        <strong>{totals.totalShippingCost.toFixed(2)} ¥</strong>
                      </div>
                      <div className="total-item">
                        <span>Total Cost</span>
                        <strong>{totals.totalCost.toFixed(2)} ¥</strong>
                      </div>
                      {rmbRate && parseFloat(rmbRate) > 0 && (
                        <div className="total-item highlight">
                          <span>Total in BDT</span>
                          <strong>{totalInBDT.toFixed(2)} ৳</strong>
                        </div>
                      )}
                    </div>
                    
                    <div className="column-visibility-section">
                      <h4>PDF Column Visibility</h4>
                      <div className="column-checkboxes">
                        {Object.entries(columnVisibility).map(([key, visible]) => (
                          <label key={key} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={visible}
                              onChange={(e) => updateColumnVisibility(key, e.target.checked)}
                            />
                            <span>{key === 'skuId' ? 'SKU ID' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={generatePDF} 
                      className="btn-generate-pdf"
                      disabled={items.length === 0 || !rmbRate || parseFloat(rmbRate) <= 0}
                    >
                      <HiDownload className="w-5 h-5" />
                      Generate PDF Invoice
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvoiceCalculator;
