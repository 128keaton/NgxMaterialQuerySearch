export const isBetweenOperator = (operator: string): boolean => {
  if (!!operator) {
    return operator === 'BETWEEN';
  }

  return false;
};

export const isNullOperator = (operator: string) => {
  const nullOperators = ['NOT_NULL', 'IS_NULL'];
  if (!!operator) {

    return nullOperators.includes(operator);
  }

  return false;
};
