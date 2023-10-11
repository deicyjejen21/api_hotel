import { request } from "express";
import { resOk } from "../utils/functions.js";
import { models } from "../libs/sequelize.js";

export class InventoryCrll {
    static async create(req = request, res) {

        const registerCreated = await models.Inventary.create(req.body, {
            include: [{ model: models.Product, as: "product" }, { model: models.Room, as: "room" }],
        });
        resOk(res, { register: registerCreated });
    }

    static async get(req = request, res) {
        let { page = 0, limit = 5, roomNumber } = req.query;
        page = Number(page);
        limit = Number(limit);

        const options = {
            offset: page ? limit * page : 0,
            limit,
        };

        if (roomNumber) {
            options.where = { roomNumber };
        }
        // resOk(res, { models: models, isnce: models.Inventory, prueba: "dw" });
        const registersFound = await models.Inventary.findAll({
            ...options,
            include: [{ model: models.Product, as: "product" }, { model: models.Room, as: "room" }],
            order: [
                ["id", "DESC"]
            ],
        });

        resOk(res, { Inventary: registersFound });
    }

    static async getById(req = request, res) {
        const { id } = req.params;
        const registerFound = await models.Inventary.findCreateFind(Number(id), {
            include: ["product", "room"],
        });
        resOk(res, { register: registerFound });
    }

    static async getByIdWithProducts(req = request, res) {
        const { id } = req.params;
        const registerFound = await models.Register.findByPk(Number(id), {
            include: [{
                    model: models.Product,
                    as: "products",
                },
                {
                    model: models.Reservation,
                    as: "reservation",
                },
            ],
        });

        resOk(res, { register: registerFound });
    }

    static async update(res, req = request) {
        resOk(res, {});
    }

    static async addConsumable(req = request, res) {
        const { productId, registerId, amount } = req.body;
        const registerProduct = await models.RegisterProduct.findOne({
            where: { productId, registerId },
        });

        if (registerProduct) {
            await registerProduct.increment({ amount });
            const UpdatedRegisterProduct = await models.RegisterProduct.findByPk(
                registerProduct.id
            );
            return resOk(res, { consumable: UpdatedRegisterProduct });
        }

        const product = await models.Product.findByPk(Number(productId));
        const newRegisterConsumable = await models.RegisterProduct.create({
            ...req.body,
            price: product.price,
        });
        resOk(res, { consumable: newRegisterConsumable });
    }

    static async delete(res, req = request) {}
}