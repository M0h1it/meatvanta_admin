import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

import LoginPage from "./features/auth/pages/LoginPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import CategoriesPage from "./features/categories/pages/CategoriesPage";
import ProductsPage from "./features/products/pages/ProductsPage";
import RolesPage from "./features/roles/pages/RolesPage";
import AdminUsersPage from "./features/adminUsers/pages/AdminUsersPage";
import AuditLogPage from "./features/auditLog/pages/AuditLogPage";
import OrdersPage from "./features/orders/pages/OrdersPage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import ShopInfoPage from "./features/shopInfo/pages/ShopInfoPage";
import DeliverySettingsPage from "./features/deliverySettings/pages/DeliverySettingsPage";
import OrderDetailPage from "./features/orders/pages/OrderDetailPage";
import ProductDetailPage from "./features/products/pages/ProductDetailPage";
import CustomersPage from "./features/customers/pages/CustomersPage";
import CustomerDetailPage from "./features/customers/pages/CustomerDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute requiredPermission="categories:view">
            <AdminLayout>
              <CategoriesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute requiredPermission="products:view">
            <AdminLayout>
              <ProductsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/roles"
        element={
          <ProtectedRoute requiredPermission="roles:view">
            <AdminLayout>
              <RolesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-users"
        element={
          <ProtectedRoute requiredPermission="admin_users:view">
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/audit-log"
        element={
          <ProtectedRoute requiredPermission="audit_log:view">
            <AdminLayout>
              <AuditLogPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute requiredPermission="orders:view">
            <AdminLayout>
              <OrdersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <SettingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/delivery-settings"
        element={
          <ProtectedRoute requiredPermission="delivery_settings:view">
            <AdminLayout>
              <DeliverySettingsPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute requiredPermission="orders:view">
            <AdminLayout>
              <OrderDetailPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <ProtectedRoute requiredPermission="customers:view">
            <AdminLayout>
              <CustomersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/customers/:id"
        element={
          <ProtectedRoute requiredPermission="customers:view">
            <AdminLayout>
              <CustomerDetailPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <ProtectedRoute requiredPermission="products:view">
            <AdminLayout>
              <ProductDetailPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/shop-info"
        element={
          <ProtectedRoute requiredPermission="shop_info:view">
            <AdminLayout>
              <ShopInfoPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
