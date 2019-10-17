import { Menu } from './menu.model';
const role_root = ['ROLE_ROOT'];
const role_admin = ['ROLE_ROOT', 'ROLE_ADMIN'];
const role_tecnico = ['ROLE_TECNICO'];
const role_cliente = ['ROLE_CLIENTE'];
const roles = ['ROLE_ROOT', 'ROLE_ADMIN', 'ROLE_TECNICO', 'ROLE_CLIENTE'];
export const verticalMenuItems = [ 
    new Menu (1, 'Estadisticas', '/dashboard', null, 'dashboard', null, false, 0, roles),
/*     new Menu (110, 'Seguridad', null, null, 'security', null, true, 0, role_admin), */         
    new Menu (111, 'Usuarios', '/seguridad/usuarios', null, 'people', null, false, 110, role_admin),
    new Menu (152, 'Consultas', '/consultas', null, 'person_pin', null, false, 0, role_admin),
    //new Menu (112, 'Perfiles', '/seguridad/perfiles', null, 'wc', null, false, 110, role_admin),
    //new Menu (113, 'Menu', '/seguridad/menu', null, 'menu', null, false, 110, role_admin),
    new Menu (152, 'Empresas', '/empresas', null, 'domain', null, false, 0, role_root),
    new Menu (125, 'Tecnicos', '/admin/tecnicos', null, 'build', null, false, 0, role_admin),
    new Menu (125, 'Clientes', '/admin/clientes', null, 'people', null, false, 0 , role_admin),
/*     new Menu (100, 'Configuraciones', null, null, 'settings', null, true, 0, roles),*/    
    new Menu (120, 'Administracion', null, null, 'business_center', null, true, 0, role_admin),
    new Menu (122, 'Protocolos', '/admin/protocolos', null, 'ballot', null, false, 120 , role_admin),
    new Menu (123, 'Instrumentos', '/admin/instrumentos', null, 'group_work', null, false, 120 , role_admin),
    new Menu (121, 'Actividades', '/admin/actividades', null, 'apps', null, false, 120 , role_admin),
    new Menu (124, 'Equipos', '/admin/equipos', null, 'build', null, false, 120 , role_admin),
/*     new Menu (130, 'Procesos', null, null, 'insert_chart', null, true, 0,  roles ) ,*/    
    new Menu (130, 'Cotizaciones', null, null, 'attach_money', null, true, 0, roles),
    new Menu (131, 'Crear', '/procesos/cotizaciones-form', null, 'money', null, false, 130, roles), // TODO:
    new Menu (132, 'Ver - Editar', '/procesos/cotizaciones', null, 'money', null, false, 130, roles), // TODO:
    new Menu (133, 'Aprobar', '/procesos/cotizaciones-por-aprobar', null, 'money', null, false, 130, roles), // TODO:
    new Menu (135, 'Ordenes de Trabajo', null, null, 'gavel', null, true, 0 , roles),
    new Menu (136, 'Programar', '/procesos/programar-orden', null, 'gavel', null, false, 135 , roles), //TODO:
    new Menu (137, 'Ver - Editar', '/procesos/orden-trabajo', null, 'gavel', null, false, 135 , roles), //TODO:
    new Menu (138, 'Reporte Mantenimiento', '/tecnicos/reporte-mantenimiento', null, 'gavel', null, false, 135, roles), //TODO:
    new Menu (150, 'Mantenimiento', '/tecnicos', null, 'today', null, false, 0, roles),
    new Menu (151, 'Historico', '/tecnicos/mantenimientos-r', null, 'history', null, false, 0, role_admin),
    new Menu (101, 'Perfil', '/home/perfil', null, 'account_circle', null, false, 0, roles),
    new Menu (46, 'Page Not Found', '/pagenotfound', null, 'error_outline', null, false, 40, roles),
    new Menu (47, 'Error', '/error', null, 'warning', null, false, 40, roles)
]

export const horizontalMenuItems = [ 
   
]