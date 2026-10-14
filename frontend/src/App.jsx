import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000'

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop Dell XPS 13', stock: 15, location: 'Hyderabad', category: 'Electronics', available: true },
    { id: 2, name: 'iPhone 15 Pro', stock: 0, location: 'Secunderabad', category: 'Electronics', available: false },
    { id: 3, name: 'Samsung TV 55 inch', stock: 8, location: 'Hayatnagar', category: 'Electronics', available: true },
    { id: 4, name: 'Nike Air Shoes', stock: 25, location: 'Hyderabad', category: 'Fashion', available: true },
    { id: 5, name: 'Office Chair', stock: 3, location: 'Warangal', category: 'Furniture', available: true },
  ])
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', stock: '', location: '', category: '' })
  const [backendStatus, setBackendStatus] = useState('Checking...')

  useEffect(() => {
    fetch(`${API_URL}/api/products`).then(r=>r.json()).then(d=>{
      if(d.length>0) setProducts(d)
      setBackendStatus('Connected')
    }).catch(()=> setBackendStatus('Offline (Using Demo Data)'))
  }, [])

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    p.location.toLowerCase().includes(location.toLowerCase())
  )

  const addProduct = async () => {
    if(!newProduct.name || !newProduct.stock) return alert('Enter name and stock')
    const prod = { 
      id: Date.now(), 
      name: newProduct.name, 
      stock: parseInt(newProduct.stock), 
      location: newProduct.location || 'Hyderabad',
      category: newProduct.category || 'General',
      available: parseInt(newProduct.stock) > 0 
    }
    try{
      const res = await fetch(`${API_URL}/api/products`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(prod)})
      if(res.ok){ const data = await res.json(); setProducts([...products, data]) } else { setProducts([...products, prod]) }
    }catch{ setProducts([...products, prod]) }
    setNewProduct({ name: '', stock: '', location: '', category: '' })
    setShowAdd(false)
  }

  const toggleStock = (id) => {
    setProducts(products.map(p => p.id===id ? {...p, stock: p.stock>0?0:10, available: p.stock===0} : p))
  }

  return (
    <div style={{fontFamily:'Segoe UI, sans-serif', background:'#f5f7fb', minHeight:'100vh', margin:0}}>
      <header style={{background:'#0f172a', color:'white', padding:'18px 30px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1 style={{margin:0, fontSize:'22px'}}>📦 Smart Availability System</h1>
        <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
          <span style={{fontSize:'12px', background: backendStatus.includes('Connected')?'#22c55e':'#f59e0b', padding:'4px 10px', borderRadius:'12px'}}>{backendStatus}</span>
          <button onClick={()=>setShowAdd(!showAdd)} style={{background:'#3b82f6', border:'none', color:'white', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', fontWeight:'600'}}>+ Add Product</button>
        </div>
      </header>

      <div style={{padding:'25px', maxWidth:'1200px', margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'15px', marginBottom:'25px'}}>
          <div style={{background:'white', padding:'18px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <div style={{color:'#64748b', fontSize:'13px'}}>Total Products</div>
            <div style={{fontSize:'24px', fontWeight:'700', color:'#0f172a'}}>{products.length}</div>
          </div>
          <div style={{background:'white', padding:'18px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <div style={{color:'#64748b', fontSize:'13px'}}>Available</div>
            <div style={{fontSize:'24px', fontWeight:'700', color:'#22c55e'}}>{products.filter(p=>p.available).length}</div>
          </div>
          <div style={{background:'white', padding:'18px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <div style={{color:'#64748b', fontSize:'13px'}}>Out of Stock</div>
            <div style={{fontSize:'24px', fontWeight:'700', color:'#ef4444'}}>{products.filter(p=>!p.available).length}</div>
          </div>
          <div style={{background:'white', padding:'18px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <div style={{color:'#64748b', fontSize:'13px'}}>Locations</div>
            <div style={{fontSize:'24px', fontWeight:'700', color:'#3b82f6'}}>{new Set(products.map(p=>p.location)).size}</div>
          </div>
        </div>

        <div style={{background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', marginBottom:'20px', display:'flex', gap:'15px', flexWrap:'wrap'}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search product name..." style={{flex:'1', minWidth:'200px', padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:'8px', outline:'none'}}/>
          <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="📍 Filter by location..." style={{flex:'1', minWidth:'200px', padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:'8px', outline:'none'}}/>
        </div>

        {showAdd && (
          <div style={{background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', marginBottom:'20px', border:'2px solid #3b82f6'}}>
            <h3 style={{marginTop:0}}>Add New Product</h3>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
              <input value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name:e.target.value})} placeholder="Product Name" style={{padding:'10px', border:'1px solid #e2e8f0', borderRadius:'6px'}}/>
              <input value={newProduct.stock} onChange={e=>setNewProduct({...newProduct, stock:e.target.value})} type="number" placeholder="Stock Quantity" style={{padding:'10px', border:'1px solid #e2e8f0', borderRadius:'6px'}}/>
              <input value={newProduct.location} onChange={e=>setNewProduct({...newProduct, location:e.target.value})} placeholder="Location (e.g. Hyderabad)" style={{padding:'10px', border:'1px solid #e2e8f0', borderRadius:'6px'}}/>
              <input value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category:e.target.value})} placeholder="Category (e.g. Electronics)" style={{padding:'10px', border:'1px solid #e2e8f0', borderRadius:'6px'}}/>
            </div>
            <button onClick={addProduct} style={{marginTop:'12px', background:'#0f172a', color:'white', padding:'10px 20px', border:'none', borderRadius:'6px', cursor:'pointer', width:'100%', fontWeight:'600'}}>Add Product</button>
          </div>
        )}

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'18px'}}>
          {filtered.map(p=>(
            <div key={p.id} style={{background:'white', borderRadius:'12px', padding:'18px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', borderLeft:`4px solid ${p.available?'#22c55e':'#ef4444'}`}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                <h3 style={{margin:'0 0 6px 0', fontSize:'16px', color:'#0f172a'}}>{p.name}</h3>
                <span style={{fontSize:'11px', padding:'3px 8px', borderRadius:'10px', background:p.available?'#dcfce7':'#fee2e2', color:p.available?'#166534':'#991b1b', fontWeight:'700'}}>{p.available?'IN STOCK':'OUT OF STOCK'}</span>
              </div>
              <div style={{fontSize:'13px', color:'#64748b', marginTop:'8px', lineHeight:'1.6'}}>
                <div>📦 Stock: <b style={{color:'#0f172a'}}>{p.stock} units</b></div>
                <div>📍 Location: <b style={{color:'#0f172a'}}>{p.location}</b></div>
                <div>🏷️ Category: {p.category}</div>
              </div>
              <button onClick={()=>toggleStock(p.id)} style={{marginTop:'12px', width:'100%', padding:'8px', border:`1px solid ${p.available?'#ef4444':'#22c55e'}`, background:'white', color:p.available?'#ef4444':'#22c55e', borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'13px'}}>
                {p.available?'Mark Out of Stock':'Mark Available'}
              </button>
            </div>
          ))}
        </div>

        <div style={{marginTop:'30px', background:'#0f172a', color:'white', padding:'18px', borderRadius:'12px', textAlign:'center', fontSize:'13px'}}>
          Final Year Project - Smart Availability System | MERN Stack | Developed by Mayukha | Hayatnagar, Telangana
        </div>
      </div>
    </div>
  )
}

export default App