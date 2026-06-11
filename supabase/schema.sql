-- SecureAttend Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants (Institutions/Schools/Companies)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (Employees/Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    khmer_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'employee', -- 'admin', 'manager', 'employee'
    face_encoding JSONB, -- For AI face match
    telegram_chat_id VARCHAR(50),
    nfc_tag_id VARCHAR(100),
    qr_code_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geofences for check-in
CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    radius_meters INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Records
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    check_in_method VARCHAR(50) NOT NULL, -- 'gps', 'face', 'qr', 'nfc'
    check_in_location JSONB, -- { lat, lng }
    status VARCHAR(50) NOT NULL DEFAULT 'present', -- 'present', 'late', 'absent'
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll Records
CREATE TABLE payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    base_salary DECIMAL NOT NULL,
    deductions DECIMAL DEFAULT 0,
    bonuses DECIMAL DEFAULT 0,
    net_pay DECIMAL NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: RLS (Row Level Security) policies should be added here in a production environment
-- to isolate tenant data.
