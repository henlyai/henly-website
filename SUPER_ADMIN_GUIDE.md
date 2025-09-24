# 🛡️ Super Admin Management System

## Overview

The Super Admin Management System provides complete cross-organization control over agents, prompts, and resources in your multi-tenant B2B platform. Only users with the `super_admin` role can access this powerful interface.

## 🗄️ **Storage Architecture**

### **LibreChat (MongoDB) - Primary Storage**
```
MongoDB Collections:
├── agents/          # All agent definitions, tools, configurations
├── promptgroups/    # All prompt templates and groups  
├── users/          # LibreChat user accounts
├── conversations/  # Chat history and sessions
└── projects/       # LibreChat's sharing mechanism
```

### **Supabase (PostgreSQL) - Organization Control**
```
Supabase Tables:
├── agent_library/     # Organization → Agent mapping & metadata
├── prompt_library/    # Organization → Prompt mapping & metadata  
├── organizations/     # Organization settings & configurations
└── profiles/         # User → Organization mapping
```

## 🎯 **How Multi-Tenant Control Works**

1. **Agent Created** → Stored in MongoDB (LibreChat native builder)
2. **Organization Assignment** → Tracked in Supabase (`agent_library`)
3. **Access Control** → Supabase RLS filters by organization
4. **Cross-Org Sharing** → Super Admin manages via marketplace tables

## 🚀 **Super Admin Features**

### **Dashboard Overview**
- **Total Organizations**: All registered organizations
- **Total Agents**: All agents across all organizations
- **Total Prompts**: All prompts across all organizations
- **Total Users**: All users in the platform

### **Agent Management**
- **View All Agents**: See agents from every organization
- **Organization Filtering**: Filter by organization or category
- **Share Agents**: Give access to other organizations
- **Duplicate Agents**: Create copies for other organizations
- **Revoke Access**: Remove shared access

### **Prompt Management**
- **View All Prompts**: See prompts from every organization
- **Organization Filtering**: Filter by organization or category
- **Share Prompts**: Give access to other organizations
- **Revoke Access**: Remove shared access

### **Organization Overview**
- **Member Counts**: Active users per organization
- **Resource Counts**: Agents and prompts per organization
- **Plan Types**: Subscription levels and limits

## 🔧 **Super Admin Actions**

### **Sharing Resources**

#### **Share Agent to Organization**
```typescript
// Gives another organization access to the same LibreChat agent
await superAdminService.shareAgent(agentId, sourceOrgId, targetOrgId)
```

#### **Duplicate Agent to Organization**
```typescript
// Creates a new LibreChat agent copy for another organization
await superAdminService.duplicateAgent(agentId, sourceOrgId, targetOrgId)
```

#### **Share Prompt to Organization**
```typescript
// Gives another organization access to the same prompt
await superAdminService.sharePrompt(promptId, sourceOrgId, targetOrgId)
```

### **Revoking Access**

#### **Revoke Resource Access**
```typescript
// Removes shared access from an organization
await superAdminService.revokeAccess('agents', resourceId, organizationId)
await superAdminService.revokeAccess('prompts', resourceId, organizationId)
```

### **Bulk Operations**

#### **Bulk Share Resources**
```typescript
// Share multiple resources to multiple organizations at once
await superAdminService.bulkShare(
  'agent',           // or 'prompt'
  resourceIds,       // array of IDs
  sourceOrgId,       // source organization
  targetOrgIds       // array of target organizations
)
```

## 🔐 **Access Control**

### **Super Admin Role**
- Must have `role: 'super_admin'` in the profiles table
- Bypasses organization-level RLS policies
- Can see and modify all resources across all organizations

### **Security Features**
- **Organization Isolation**: Regular users only see their org's resources
- **Audit Trail**: All super admin actions are logged
- **Permission Validation**: API routes verify super admin status
- **Secure Endpoints**: Protected by JWT authentication

## 🎛️ **API Endpoints**

### **Statistics**
- `GET /api/super-admin/stats` - Dashboard statistics

### **Resource Management**
- `GET /api/super-admin/agents` - All agents across organizations
- `GET /api/super-admin/prompts` - All prompts across organizations
- `GET /api/super-admin/organizations` - All organizations with stats

### **Sharing Operations**
- `POST /api/super-admin/agents/:id/share` - Share agent to organization
- `POST /api/super-admin/agents/:id/duplicate` - Duplicate agent
- `POST /api/super-admin/prompts/:id/share` - Share prompt to organization

### **Access Management**
- `DELETE /api/super-admin/:resourceType/:id/revoke` - Revoke access
- `POST /api/super-admin/bulk-share` - Bulk sharing operations

## 🔄 **Workflow Examples**

### **Scenario 1: Share Best Practice Agent**
1. **Identify High-Performing Agent**: Organization A has a great sales agent
2. **Super Admin Review**: Check agent performance and quality
3. **Share to Selected Orgs**: Share to organizations B, C, D
4. **Monitor Usage**: Track adoption and performance across orgs

### **Scenario 2: Distribute Default Content**
1. **Create Master Templates**: Develop high-quality agents/prompts
2. **Bulk Distribution**: Share to all new organizations
3. **Customize per Org**: Allow organizations to modify as needed
4. **Version Control**: Update masters and propagate changes

### **Scenario 3: Manage Resource Access**
1. **Review Sharing**: Audit which resources are shared where
2. **Quality Control**: Revoke access to low-quality content
3. **Compliance**: Ensure resources meet platform standards
4. **Optimization**: Remove unused or duplicate resources

## 📊 **Monitoring & Analytics**

### **Dashboard Metrics**
- **Resource Distribution**: How many agents/prompts per organization
- **Sharing Activity**: Most shared resources and trends
- **Organization Growth**: New orgs and resource adoption
- **Usage Patterns**: Which categories are most popular

### **Performance Tracking**
- **Agent Effectiveness**: Usage statistics per shared agent
- **Prompt Performance**: Success rates of shared prompts
- **Organization Health**: Active vs inactive organizations
- **Resource Quality**: User feedback and ratings

## 🚀 **Best Practices**

### **Content Curation**
- **Quality Review**: Test agents/prompts before sharing
- **Documentation**: Ensure clear descriptions and instructions
- **Categorization**: Use consistent business categories
- **Version Management**: Track updates and improvements

### **Access Management**
- **Strategic Sharing**: Share based on organization needs
- **Regular Audits**: Review and clean up shared resources
- **Performance Monitoring**: Track success of shared content
- **Feedback Loop**: Collect input from receiving organizations

### **Security & Compliance**
- **Audit Logging**: Track all super admin actions
- **Role Verification**: Regularly review super admin access
- **Data Protection**: Ensure shared content meets privacy standards
- **Backup Strategy**: Maintain backups of critical resources

## 🔧 **Troubleshooting**

### **Common Issues**
- **Access Denied**: Verify user has `super_admin` role
- **Missing Resources**: Check organization isolation and RLS policies
- **Sharing Failures**: Validate organization IDs and permissions
- **Sync Issues**: Ensure LibreChat and Supabase are connected

### **Maintenance Tasks**
- **Clean Up**: Remove orphaned resources and broken links
- **Optimize Performance**: Monitor query performance and add indexes
- **Update Categories**: Evolve business categories as needed
- **Scale Resources**: Monitor and adjust for growing organizations

This system provides enterprise-grade control over your multi-tenant agent marketplace while leveraging LibreChat's sophisticated native builder. Super admins have complete visibility and control while maintaining security and organization isolation for regular users.
