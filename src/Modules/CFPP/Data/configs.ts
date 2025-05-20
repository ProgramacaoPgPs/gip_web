export interface NavItem {
  label: string;
  subItems?: NavItem[];
  onAction?: (value: any) => void;
}

export const navItems = (setRegister: () => void, setCalculation: () => void): NavItem[] => [
  {
    label: 'Registrar',
    onAction: (value: any) => setRegister()
  },
  {
    label: 'Funcionários',
    subItems: [
      {
        onAction: (value: any) => { setCalculation() },
        label: 'Relatórios',
      },
    ],
  }
];