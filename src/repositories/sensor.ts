import SensorModel, { Definition, Type } from '../models/sensor';

export const getAll = async (): Promise<Definition[]> => {
  return SensorModel.findAll({
    order: [['createdAt', 'DESC']],
  });
};

export const getByType = async (type: Type): Promise<Definition | null> => {
  return SensorModel.findOne({ where: { type } });
};
