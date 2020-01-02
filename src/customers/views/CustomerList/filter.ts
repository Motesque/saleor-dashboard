import { IntlShape } from "react-intl";

import { CustomerFilterInput } from "@saleor/types/globalTypes";
import { maybe } from "@saleor/misc";
import {
  createDateField,
  createNumberField
} from "@saleor/utils/filters/fields";
import { IFilter, IFilterElement } from "@saleor/components/Filter";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import {
  CustomerListUrlFilters,
  CustomerListUrlFiltersEnum,
  CustomerListUrlQueryParams
} from "../../urls";
import { CustomerListFilterOpts } from "../../types";
import messages from "./messages";

export const CUSTOMER_FILTERS_KEY = "customerFilters";

export enum CustomerFilterKeys {
  joined = "joined",
  moneySpent = "spent",
  numberOfOrders = "orders"
}

export function getFilterOpts(
  params: CustomerListUrlFilters
): CustomerListFilterOpts {
  return {
    joined: {
      active: maybe(
        () =>
          [params.joinedFrom, params.joinedTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.joinedTo, ""),
        min: maybe(() => params.joinedFrom, "")
      }
    },
    moneySpent: {
      active: maybe(
        () =>
          [params.moneySpentFrom, params.moneySpentTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.moneySpentTo, ""),
        min: maybe(() => params.moneySpentFrom, "")
      }
    },
    numberOfOrders: {
      active: maybe(
        () =>
          [params.numberOfOrdersFrom, params.numberOfOrdersTo].some(
            field => field !== undefined
          ),
        false
      ),
      value: {
        max: maybe(() => params.numberOfOrdersTo, ""),
        min: maybe(() => params.numberOfOrdersFrom, "")
      }
    }
  };
}

export function createFilterStructure(
  intl: IntlShape,
  opts: CustomerListFilterOpts
): IFilter<CustomerFilterKeys> {
  return [
    {
      ...createDateField(
        CustomerFilterKeys.joined,
        intl.formatMessage(messages.joinDate),
        opts.joined.value
      ),
      active: opts.joined.active
    },
    {
      ...createNumberField(
        CustomerFilterKeys.moneySpent,
        intl.formatMessage(messages.moneySpent),
        opts.moneySpent.value
      ),
      active: opts.moneySpent.active
    },
    {
      ...createNumberField(
        CustomerFilterKeys.numberOfOrders,
        intl.formatMessage(messages.numberOfOrders),
        opts.numberOfOrders.value
      ),
      active: opts.numberOfOrders.active
    }
  ];
}

export function getFilterVariables(
  params: CustomerListUrlFilters
): CustomerFilterInput {
  return {
    dateJoined: {
      gte: params.joinedFrom,
      lte: params.joinedTo
    },
    moneySpent: {
      gte: parseInt(params.moneySpentFrom, 0),
      lte: parseInt(params.moneySpentTo, 0)
    },
    numberOfOrders: {
      gte: parseInt(params.numberOfOrdersFrom, 0),
      lte: parseInt(params.numberOfOrdersTo, 0)
    },
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<CustomerFilterKeys>
): CustomerListUrlFilters {
  const { active, multiple, name, value } = filter;

  switch (name) {
    case CustomerFilterKeys.joined:
      if (!active) {
        return {
          joinedFrom: undefined,
          joinedTo: undefined
        };
      }
      if (multiple) {
        return {
          joinedFrom: value[0],
          joinedTo: value[1]
        };
      }

      return {
        joinedFrom: value[0],
        joinedTo: value[0]
      };

    case CustomerFilterKeys.moneySpent:
      if (!active) {
        return {
          moneySpentFrom: undefined,
          moneySpentTo: undefined
        };
      }
      if (multiple) {
        return {
          moneySpentFrom: value[0],
          moneySpentTo: value[1]
        };
      }

      return {
        moneySpentFrom: value[0],
        moneySpentTo: value[0]
      };

    case CustomerFilterKeys.numberOfOrders:
      if (!active) {
        return {
          numberOfOrdersFrom: undefined,
          numberOfOrdersTo: undefined
        };
      }
      if (multiple) {
        return {
          numberOfOrdersFrom: value[0],
          numberOfOrdersTo: value[1]
        };
      }

      return {
        numberOfOrdersFrom: value[0],
        numberOfOrdersTo: value[0]
      };
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<CustomerListUrlFilters>(CUSTOMER_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  CustomerListUrlQueryParams,
  CustomerListUrlFilters
>(CustomerListUrlFiltersEnum);
