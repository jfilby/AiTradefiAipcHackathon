export class InstanceRefModel {

  // Consts
  clName = 'InstanceRefModel'

  // Code
  async create(
          prisma: any,
          instanceId: string,
          refInstanceId: string,
          refType: string,
          refDescription: string | undefined) {

    // Debug
    const fnName = `${this.clName}.create()`

    // Create record
    try {
      return await prisma.instanceRef.create({
        data: {
          instanceId: instanceId,
          refInstanceId: refInstanceId,
          refType: refType,
          refDescription: refDescription
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async deleteByInstanceId(
          prisma: any,
          instanceId: string) {

    // Debug
    const fnName = `${this.clName}.deleteByInstanceId()`

    // Delete records
    try {
      return await prisma.instanceRef.deleteMany({
        where: {
          OR: [
            {
              instanceId: instanceId
            },
            {
              refInstanceId: instanceId
            }
          ]
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async filter(
          prisma: any,
          instanceId: string | undefined,
          refInstanceId: string | undefined,
          refType: string | undefined,
          includeInstance: boolean = false,
          includeRefInstance: boolean = false) {

    // Debug
    const fnName = `${this.clName}.filter()`

    // Query
    try {
      return await prisma.instanceRef.findMany({
        include: {
          instance: includeInstance,
          refInstance: includeRefInstance
        },
        where: {
          instanceId: instanceId,
          refInstanceId: refInstanceId,
          refType: refType
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async getById(
          prisma: any,
          id: string) {

    // Debug
    const fnName = `${this.clName}.getById()`

    // Query
    var instanceRef: any = null

    try {
      instanceRef = await prisma.instanceRef.findUnique({
        where: {
          id: id
        }
      })
    } catch(error: any) {
      if (!(error instanceof error.NotFound)) {
        console.error(`${fnName}: error: ${error}`)
        throw 'Prisma error'
      }
    }

    // Return
    return instanceRef
  }

  async getByInstanceIdAndRefInstanceId(
          prisma: any,
          instanceId: string,
          refInstanceId: string) {

    // Debug
    const fnName = `${this.clName}.getByInstanceIdAndRefInstanceId()`

    // Validate
    if (instanceId == null) {
      console.error(`${fnName}: instanceId == null`)
      throw 'Validation error'
    }

    if (refInstanceId == null) {
      console.error(`${fnName}: refInstanceId == null`)
      throw 'Validation error'
    }

    // Query
    var instanceRef: any

    try {
      instanceRef = await prisma.instanceRef.findFirst({
        where: {
          instanceId: instanceId,
          refInstanceId: refInstanceId
        }
      })
    } catch(error: any) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }

    // Return
    return instanceRef
  }

  async update(
          prisma: any,
          id: string,
          instanceId: string | undefined,
          refInstanceId: string | undefined,
          refType: string | undefined,
          refDescription: string | undefined) {

    // Debug
    const fnName = `${this.clName}.update()`

    // Update record
    try {
      return await prisma.instanceRef.update({
        data: {
          instanceId: instanceId,
          refInstanceId: refInstanceId,
          refType: refType,
          refDescription: refDescription
        },
        where: {
          id: id
        }
      })
    } catch(error) {
      console.error(`${fnName}: error: ${error}`)
      throw 'Prisma error'
    }
  }

  async upsert(prisma: any,
               id: string | undefined,
               instanceId: string | undefined,
               refInstanceId: string | undefined,
               refType: string | undefined,
               refDescription: string | undefined) {

    // Debug
    const fnName = `${this.clName}.upsert()`

    // If id isn't specified, try to get by the unique key
    if (id == null &&
        instanceId != null &&
        refInstanceId != null) {

      const instanceRef = await
              this.getByInstanceIdAndRefInstanceId(
                prisma,
                instanceId,
                refInstanceId)

      if (instanceRef != null) {
        id = instanceRef.id
      }
    }

    // Upsert
    if (id == null) {

      // Validate for create (mainly for type validation of the create call)
      if (instanceId == null) {
        console.error(`${fnName}: id is null and instanceId is null`)
        throw 'Prisma error'
      }

      if (refInstanceId == null) {
        console.error(`${fnName}: id is null and refInstanceId is null`)
        throw 'Prisma error'
      }

      if (refType == null) {
        console.error(`${fnName}: id is null and refType is null`)
        throw 'Prisma error'
      }

      // Create
      return await
               this.create(
                 prisma,
                 instanceId,
                 refInstanceId,
                 refType,
                 refDescription)
    } else {

      // Update
      return await
               this.update(
                 prisma,
                 id,
                 instanceId,
                 refInstanceId,
                 refType,
                 refDescription)
    }
  }
}
