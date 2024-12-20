import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: 'dashboard/home',
    nombre: 'Principal',
    icono: 'home',
    // role: [1, 2],
    type: 'item',
    url: 'home',
  },
  // PAGOS DEL SISTEMA 
  // {
  //   id: 'philately-admin',
  //   nombre: 'Pagos Soporte',
  //   title: 'Pagos Soporte',
  //   role: [1,2],
  //   type: 'collapsible',
  //   icono: 'dollar-sign',
  //   children: [
  //     {
  //       id: 'report-payment',
  //       nombre: 'Reportar Pago',
  //       type: 'item',
  //       icono: 'circle',
  //       url: 'license/report-payment'
  //     },
  //   ]
  // },
    // PAGOS DEL SISTEMA 
    // {
    //   id: 'philately-admin',
    //   nombre: 'Pagos Soporte',
    //   title: 'Pagos Soporte',
    //   role: [3],
    //   type: 'collapsible',
    //   icono: 'dollar-sign',
    //   children: [
    //     {
    //       id: 'report-payment',
    //       nombre: 'Lista Pagos',
    //       type: 'item',
    //       icono: 'circle',
    //       url: 'license/report-payment'
    //     },
    //   ]
    // },

  // FILATELIA ADMIN
  {
    id: 'philately-admin',
    nombre: 'Franqueo Previo',
    title: 'Franqueo Previo',
    role: [3],
    type: 'collapsible',
    icono: 'trello',
    children: [
      {
        id: 'sale-of-philately',
        nombre: 'Ventas',
        type: 'item',
        icono: 'circle',
        url: 'philately/sale-of-philately'
      }
    ]
  },
  //  DUPVEN ADMIN
  {
    id: 'philately-admin',
    nombre: 'DupVen',
    title: 'DupVen',
    role: [3],
    type: 'collapsible',
    icono: 'truck',
    children: [
      {
        id: 'sale-of-philately',
        nombre: 'Ventas',
        type: 'item',
        icono: 'circle',
        url: '#'
      }
    ]
  },
  // ENVIARVEN ADMIN
  {
    id: 'philately-admin',
    nombre: 'EnviarVen',
    title: 'EnviarVen',
    role: [3],
    type: 'collapsible',
    icono: 'map-pin',
    children: [
      {
        id: 'sale-of-philately',
        nombre: 'Ventas',
        type: 'item',
        icono: 'circle',
        url: '#'
      }
    ]
  },
  // FILATELIA OPP SUB
  {
    id: 'philately-admin',
    nombre: 'Franqueo Previo',
    title: 'Franqueo Previo',
    role: [1, 2],
    type: 'collapsible',
    icono: 'trello',
    children: [
      {
        id: 'fpp/acquisition',
        nombre: 'Adqusición',
        type: 'item',
        icono: 'circle',
        url: 'fpp/acquisition'
      },
      {
        id: 'fpp/box-office-allocation',
        nombre: 'Asignación Taquilla',
        type: 'item',
        icono: 'circle',
        url: 'fpp/box-office-allocation'
      },
      {
        id: 'asignacion-agente',
        nombre: 'Asignación Agencias',
        type: 'item',
        icono: 'circle',
        url: 'fpp/box-office-agency'
      },
      {
        id: 'fpp/inventary-stock',
        nombre: 'Inventario Stock',
        type: 'item',
        icono: 'circle',
        url: 'fpp/inventary-stock'
      },

    ]
  },
  //  DUPVEN OPP SUB
  {
    id: 'philately-admin',
    nombre: 'DupVen',
    title: 'DupVen',
    role: [1, 2],
    type: 'collapsible',
    icono: 'truck',
    children: [
      {
        id: 'elaborar-guia',
        nombre: 'Elaborar Guia',
        type: 'item',
        icono: 'circle',
        url: 'dupven/prepare-guide'
      },
      {
        id: 'lista-guia',
        nombre: 'Lista Guias',
        type: 'item',
        icono: 'circle',
        url: 'dupven/guide-list'
      }
    ]
  },
  // ENVIARVEN OPP SUB
  {
    id: 'philately-admin',
    nombre: 'EnviarVen',
    title: 'EnviarVen',
    role: [1, 2],
    type: 'collapsible',
    icono: 'map-pin',
    children: [
      {
        id: 'desglose',
        nombre: 'Desglose de Guia',
        type: 'item',
        icono: 'circle',
        url: '#'
      },
      {
        id: 'stock',
        nombre: 'Quejas y Reclamos',
        type: 'item',
        icono: 'circle',
        url: '#'
      },
      {
        id: 'stock',
        nombre: 'Calificación Servicio',
        type: 'item',
        icono: 'circle',
        url: '#'
      },
    ]
  },
  // AUDITORIA
  {
    id: 'audit',
    nombre: 'Auditoria',
    role: [3, 4],
    icono: 'database',
    type: 'item',
    url: 'audit/audit',
  },

  // RELACION DE PAGOS
  {
    id: 'paymet-relations',
    nombre: 'Relacion Pagos',
    role: [3, 4, 6],
    icono: 'credit-card',
    type: 'item',
    url: 'paymet-relations/paymet',
  },
  // OPERADORES POSTALES PRIVADOS Y SUBCONTRATISTAS
  {
    id: 'list-opp',
    nombre: 'OPP-SUB',
    icono: 'list',
    type: 'item',
    role: [3, 6],
    url: 'management/private-postal-operator',
  },
  // PAGO OBLIGACIONES ADMIN
  {
    id: 'payments-obligation',
    nombre: 'Pagos Obligaciones',
    icono: 'credit-card',
    type: 'item',
    role: [3, 6],
    url: 'payments-obligations/obligations',
  },

  // MODULO OPERADOR POSTAL Y SUBCONTRATISTAS

  // Empresa
  {
    id: 'EmpresaOPP',
    nombre: 'Empresa',
    role: [1, 2],
    icono: 'layout',
    type: 'item',
    url: 'business/opp',
  },
  // Franqueo Postal
  {
    id: 'FanqueoPostal',
    nombre: 'Franqueo Postal',
    title: 'Franqueo Postal',
    role: [1],
    type: 'collapsible',
    icono: 'file-text',
    children: [
      {
        id: 'TablaPrecios',
        nombre: 'Tabla de Tarifas',
        type: 'item',
        icono: 'circle',
        url: 'postage/price-table'
      },
      {
        id: 'MovementOfParts',
        nombre: 'Declaración de Piezas',
        type: 'item',
        icono: 'circle',
        url: 'postage/postage-per-month'
      }
    ]
  },
  // Subcontratistas Postal
  {
    id: 'Subcontratistas',
    nombre: 'Subcontratistas',
    role: [1],
    icono: 'users',
    type: 'item',
    url: 'business/subcontractor',
  },
  // SUCURSALES SUBCONTRATISTAS
  {
    id: 'Agencias',
    nombre: 'Agencias',
    role: [2],
    icono: 'users',
    type: 'item',
    url: 'subcontractor/branch-offices',
  },
  // Pagos Postal
  {
    id: 'PagosPostales',
    nombre: 'Pagos',
    role: [1, 2],
    icono: 'credit-card',
    type: 'item',
    url: 'payments/payments-list',
  },
  // Solvencia Postal
  {
    id: 'postal-solvency-opp',
    nombre: 'Solvencia Postal',
    icono: 'repeat',
    type: 'item',
    url: 'postal-solvency/postal-solvency-opp-sub',
    role: [1],
  },
  // Reportes
  {
    id: 'reports',
    nombre: 'Ranking',
    role: [1],
    icono: 'trending-up',
    type: 'item',
    url: 'opp-reports/reports-ranking',
  },


  // MENU ADMINISTRACION

  {
    id: 'register-opp-sub',
    nombre: 'Registrar OPP - SUB',
    title: 'Registrar OPP - SUB',
    role: [3,6],
    type: 'collapsible',
    icono: 'edit',
    children: [
      {
        id: 'register-opp',
        nombre: 'Registrar Opp',
        type: 'item',
        icono: 'circle',
        url: 'register-opp'
      },
      {
        id: 'register-sub',
        nombre: 'Registrar Subcontratista',
        type: 'item',
        icono: 'circle',
        url: 'register-sub'
      },
    ]
  },

  {
    id: 'TablaPrecios',
    nombre: 'Franqueo Postal',
    icono: 'file-text',
    type: 'item',
    url: 'postage/price-table-opp',
    role: [3, 6],
  },
  // Solvencia Postal
  {
    id: 'postal-solvency',
    nombre: 'Solvencia Postal',
    icono: 'repeat',
    type: 'item',
    url: 'postal-solvency',
    role: [3, 6],
  },
  // Multas y Sanciones
  {
    id: 'finesandpenalties',
    nombre: 'Multas F.P.O',
    icono: 'trending-down',
    type: 'item',
    url: 'fines-and-penalties/fines-penalties',
    role: [3, 6],
  },
  //  REPORTES
  {
    id: 'reports',
    nombre: 'Reportes',
    icono: 'bar-chart-2',
    type: 'item',
    role: [3, 6],
    url: 'admin-reports/admin-reports',
  },
  //  RECAUDACION
  {
    id: 'takings',
    nombre: 'Recaudacion',
    icono: 'credit-card',
    type: 'item',
    role: [3, 6],
    url: 'takings/list-payments',
  },
  //  ARCHIVO DIGITAL POSTAL
  {
    id: 'digital-file-opp',
    nombre: 'Archivo Digital P',
    icono: 'folder-plus',
    type: 'item',
    role: [3, 4, 5, 6],
    url: 'digital-file-opp/private-postal-operator',
  },
  //  ACTUALIZACION DE SISTEMA
  {
    id: 'update-system',
    nombre: 'Actualizar SIRPV',
    icono: 'refresh-ccw',
    type: 'item',
    role: [3, 4],
    url: 'update-system/system-pull',
  },
  // Soporte
  {
    id: 'config',
    nombre: 'Configuración',
    title: 'Configuración',
    type: 'collapsible',
    icono: 'tool',
    // hidden: true,
    role: [3, 4],
    children: [
      {
        id: 'systemHors',
        nombre: 'Estatus Sistema',
        type: 'item',
        icono: 'circle',
        url: 'settings/connection-settings'
      },
      // {
      //   id: 'permisosusuarios',
      //   nombre: 'Permisos de Usuarios',
      //   type: 'item',
      //   icono: 'circle',
      //   url: 'support/permissions-user'
      // },
      // {
      //   id: 'gestiontablas',
      //   nombre: 'Gestion Tablas',
      //   type: 'item',
      //   icono: 'circle',
      //   url: 'support/table-management'
      // },
      // {
      //   id: 'cambiarcontraseña',
      //   nombre: 'Cambiar Contraseña',
      //   type: 'item',
      //   icono: 'circle',
      //   url: 'support/change-password'
      // },
      {
        id: 'users-system',
        nombre: 'Usuarios',
        type: 'item',
        icono: 'circle',
        url: 'settings/system-users'
      },
    ]
  },

  // Asistente Virtual
  {
    id: 'asistente-virtual',
    nombre: 'Asistente Virtual',
    role: [3, 4],
    icono: 'cpu',
    type: 'item',
    url: 'virtual-assistant',
  },
];
