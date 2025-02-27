export interface NavItem {
    label: string;
    path?: string;
    subItems?: NavItem[];
  }
  
  export const navItems: NavItem[] = [
    {
      label: 'Home',
      path: '/home',
    },
    {
      label: 'Funcionários',
      path:'/home',
      subItems: [
        {
          label: 'Cadastrar',
          path: '/home',
        },
        {
          label: 'Relatórios',
          path: '/home',
        },
      ],
    },
    {
      label: 'Sobre',
      path: '/home',
    },
    {
      label: 'Contato',
      path: '/home',
    },
  ];